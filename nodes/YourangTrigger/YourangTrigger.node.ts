import { createHmac, timingSafeEqual } from 'crypto';
import {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
	NodeApiError,
	NodeConnectionTypes,
	JsonObject,
} from 'n8n-workflow';

/**
 * Available outbound events (V1 contract - see Linear YR-238 / YR-239).
 * The platform emits these to the subscription `webhook_url`.
 */
const EVENT_OPTIONS = [
	{
		name: 'Call Ended',
		value: 'call.ended',
		description: 'A call finished and its record was persisted',
	},
	{
		name: 'Call Summary Ready',
		value: 'call.summary_ready',
		description: 'The async summary of a call is ready',
	},
	{
		name: 'Appointment Booked',
		value: 'appointment.booked',
		description: 'An appointment/event was created (status CONFIRMED)',
	},
	{
		name: 'Appointment Updated',
		value: 'appointment.updated',
		description: 'An appointment was rescheduled, approved or rejected',
	},
	{
		name: 'Appointment Cancelled',
		value: 'appointment.cancelled',
		description: 'An appointment moved to deletion/cancellation',
	},
	{
		name: 'Contact Created',
		value: 'contact.created',
		description: 'A new contact (lead) was created',
	},
	{
		name: 'Call Transcript Ready',
		value: 'call.transcript_ready',
		description: 'The transcript of a call is available',
	},
	{
		name: 'Order Created',
		value: 'order.created',
		description: 'A new order was created',
	},
	{
		name: 'Order Status Changed',
		value: 'order.status_changed',
		description: 'An order changed status (confirmed, completed, cancelled, refused)',
	},
	{
		name: 'Dialer Contact Completed',
		value: 'dialer.contact.completed',
		description: 'A campaign contact reached a terminal outcome',
	},
	{
		name: 'Dialer Campaign Completed',
		value: 'dialer.campaign.completed',
		description: 'A dialer campaign finished processing all contacts',
	},
];

interface SubscriptionStaticData {
	subscriptionId?: string;
	secret?: string;
	seenEventIds?: string[];
}

/**
 * Extract the HTTP status code from an n8n/HTTP error, as a string.
 * n8n surfaces it as `httpCode` (string); the raw request error uses
 * `statusCode` / `response.statusCode`.
 */
function httpErrorStatus(error: unknown): string | undefined {
	const e = error as {
		httpCode?: string | number;
		statusCode?: number;
		response?: { statusCode?: number; status?: number };
	};
	const status = e.httpCode ?? e.statusCode ?? e.response?.statusCode ?? e.response?.status;
	return status === undefined ? undefined : String(status);
}

/**
 * Build the webhook-subscriptions collection URL from the credential base URL.
 * Webhook subscriptions live on the SAME external API as the data endpoints
 * (e.g. {baseUrl}/contacts), so the collection is simply {baseUrl}/webhooks
 * (which the platform serves at /api/external/v1/webhooks).
 */
function webhooksUrl(baseUrl: string): string {
	return `${baseUrl.replace(/\/+$/, '')}/webhooks`;
}

export class YourangTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Yourang Trigger',
		name: 'yourangTrigger',
		icon: 'file:yourang.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description:
			'Starts the workflow when yourang emits an event (call ended, appointment booked, contact created, etc.)',
		defaults: {
			name: 'Yourang Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'yourangApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				options: EVENT_OPTIONS,
				default: ['call.ended'],
				description: 'The yourang events that should start this workflow',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add option',
				default: {},
				options: [
					{
						displayName: 'Auto-Register Subscription',
						name: 'autoRegister',
						type: 'boolean',
						default: true,
						description:
							'Whether to automatically create/delete the webhook subscription on yourang when the workflow is activated/deactivated. Turn off to manage the subscription manually (e.g. to test by POSTing to the webhook URL directly).',
					},
					{
						displayName: 'Verify Signature',
						name: 'verifySignature',
						type: 'boolean',
						default: true,
						description:
							'Whether to verify the X-Webhook-Signature HMAC header. Only enforced when a subscription secret is known (auto-register on).',
					},
					{
						displayName: 'Deduplicate by Event ID',
						name: 'dedupe',
						type: 'boolean',
						default: true,
						description:
							'Whether to ignore events whose event_id was already received (at-least-once delivery safety)',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const options = this.getNodeParameter('options', {}) as IDataObject;
				const autoRegister = options.autoRegister !== false;
				if (!autoRegister) {
					return true;
				}

				const staticData = this.getWorkflowStaticData('node') as SubscriptionStaticData;
				if (!staticData.subscriptionId) {
					return false;
				}

				const credentials = await this.getCredentials('yourangApi');
				const url = `${webhooksUrl(credentials.baseUrl as string)}/${staticData.subscriptionId}`;
				try {
					await this.helpers.httpRequestWithAuthentication.call(this, 'yourangApi', {
						method: 'GET',
						url,
					});
					return true;
				} catch (error) {
					// Only a 404 means the subscription is really gone -> forget it so
					// n8n recreates it. On transient errors (401/429/5xx/network) keep the
					// stored id+secret, otherwise we'd create a duplicate subscription and
					// lose the signing secret.
					if (httpErrorStatus(error) === '404') {
						delete staticData.subscriptionId;
						delete staticData.secret;
						return false;
					}
					return true;
				}
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const options = this.getNodeParameter('options', {}) as IDataObject;
				const autoRegister = options.autoRegister !== false;
				const events = this.getNodeParameter('events', []) as string[];
				const staticData = this.getWorkflowStaticData('node') as SubscriptionStaticData;

				if (!autoRegister) {
					// Manual mode: no API call. webhook() filters on the live `events`
					// parameter, so nothing needs to be stored here.
					return true;
				}

				const webhookUrl = this.getNodeWebhookUrl('default');
				const credentials = await this.getCredentials('yourangApi');
				const url = webhooksUrl(credentials.baseUrl as string);

				const body: IDataObject = {
					webhook_url: webhookUrl,
					events,
					description: 'n8n Yourang Trigger',
				};

				let response: IDataObject;
				try {
					response = (await this.helpers.httpRequestWithAuthentication.call(
						this,
						'yourangApi',
						{
							method: 'POST',
							url,
							body,
						},
					)) as IDataObject;
				} catch (error) {
					throw new NodeApiError(this.getNode(), error as JsonObject, {
						message: 'Failed to create yourang webhook subscription',
						description:
							'The platform webhook subscriptions API ({baseUrl}/webhooks) may not be available yet. Turn off "Auto-Register Subscription" to test the node manually.',
					});
				}

				// The external API wraps payloads as { ok, data: {...} }. The raw signing
				// secret is returned exactly once here and is what the platform uses to
				// sign deliveries, so we must store THIS secret.
				const data = ((response.data as IDataObject) ?? response) as IDataObject;
				const id = data.id as string | undefined;
				const secret = data.secret as string | undefined;
				if (!id) {
					// POST succeeded but we can't identify the subscription -> surface it
					// instead of silently leaving an unmanageable (orphan) subscription.
					throw new NodeApiError(this.getNode(), response as JsonObject, {
						message: 'yourang webhook subscription response did not include an id',
						description: 'Cannot manage a subscription without its id; aborting activation.',
					});
				}

				staticData.subscriptionId = id;
				staticData.secret = secret;
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node') as SubscriptionStaticData;
				const subscriptionId = staticData.subscriptionId;

				if (!subscriptionId) {
					// Manual mode or never registered: just clear any local dedupe state.
					delete staticData.secret;
					delete staticData.seenEventIds;
					return true;
				}

				const credentials = await this.getCredentials('yourangApi');
				const url = `${webhooksUrl(credentials.baseUrl as string)}/${subscriptionId}`;
				try {
					await this.helpers.httpRequestWithAuthentication.call(this, 'yourangApi', {
						method: 'DELETE',
						url,
					});
				} catch (error) {
					// 404 -> already gone, fall through and clear. Any other error means
					// the subscription may still be live; keep local state so n8n can
					// retry deletion rather than orphaning it on the platform.
					if (httpErrorStatus(error) !== '404') {
						return false;
					}
				}

				delete staticData.subscriptionId;
				delete staticData.secret;
				delete staticData.seenEventIds;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const options = this.getNodeParameter('options', {}) as IDataObject;
		const verifySignature = options.verifySignature !== false;
		const dedupe = options.dedupe !== false;
		const selectedEvents = this.getNodeParameter('events', []) as string[];

		const req = this.getRequestObject();
		const body = this.getBodyData() as IDataObject;
		const staticData = this.getWorkflowStaticData('node') as SubscriptionStaticData;

		const ignore = (): IWebhookResponseData => ({
			webhookResponse: { status: 200, body: { ok: true } } as IDataObject,
		});

		// 1. Signature verification (only when a secret is known).
		if (verifySignature && staticData.secret) {
			const headerSig = (this.getHeaderData() as IDataObject)['x-webhook-signature'] as
				| string
				| undefined;
			// The platform signs the RAW request body bytes. We must verify against the
			// same bytes - re-serializing the parsed body (JSON.stringify) would differ in
			// key order/whitespace and never match, so require the raw body.
			const rawBody: Buffer | undefined = (req as unknown as { rawBody?: Buffer }).rawBody;
			if (!rawBody || !rawBody.length) {
				return {
					webhookResponse: {
						status: 401,
						body: { error: 'raw body unavailable for signature verification' },
					} as IDataObject,
				};
			}
			const expected =
				'sha256=' + createHmac('sha256', staticData.secret).update(rawBody).digest('hex');

			if (!headerSig || !safeEqual(headerSig, expected)) {
				return {
					webhookResponse: { status: 401, body: { error: 'invalid signature' } } as IDataObject,
				};
			}
		}

		// 2. Event-type filtering (defensive - platform should already filter).
		// Treat a missing/empty event as "not subscribed" so unknown payloads are ignored.
		const eventName = body.event as string | undefined;
		if (selectedEvents.length && (!eventName || !selectedEvents.includes(eventName))) {
			return ignore();
		}

		// 3. Deduplicate by event_id.
		if (dedupe && body.event_id) {
			const seen = staticData.seenEventIds ?? [];
			if (seen.includes(body.event_id as string)) {
				return ignore();
			}
			seen.push(body.event_id as string);
			// keep only the last 500 ids
			staticData.seenEventIds = seen.slice(-500);
		}

		return {
			workflowData: [this.helpers.returnJsonArray([body])],
		};
	}
}

/**
 * Constant-time comparison of two equal-length signature strings.
 */
function safeEqual(a: string, b: string): boolean {
	const bufA = Buffer.from(a);
	const bufB = Buffer.from(b);
	if (bufA.length !== bufB.length) {
		return false;
	}
	return timingSafeEqual(bufA, bufB);
}

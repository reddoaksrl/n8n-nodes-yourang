import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';
import { yourangOperations, yourangFields } from './YourangDescription';

export class Yourang implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Yourang',
		name: 'yourang',
		icon: { light: 'file:yourang.svg', dark: 'file:yourang.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Yourang.ai - 24/7 AI phone assistant for calls, contacts, actions, and events',
		defaults: {
			name: 'Yourang',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'yourangApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Call History',
						value: 'callHistory',
						description: 'Retrieve and manage call history records',
					},
					{
						name: 'Contact',
						value: 'contact',
						description: 'Manage customer contacts and information',
					},
					{
						name: 'Action',
						value: 'action',
						description: 'Execute actions and manage action configurations',
					},
					{
						name: 'Event',
						value: 'event',
						description: 'Manage calendar events and appointments',
					},
				],
				default: 'callHistory',
			},
			...yourangOperations,
			...yourangFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		
		// Get base URL from credentials
		const credentials = await this.getCredentials('yourangApi');
		const baseUrl = credentials.baseUrl as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: any;

				// Call History operations
				if (resource === 'callHistory') {
					if (operation === 'get') {
						const callId = this.getNodeParameter('callId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'yourangApi',
							{
								method: 'GET',
								url: `${baseUrl}/call-history/${callId}`,
							}
						);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as any;

						let qs: any = {};

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
						}

						// Add filters
						if (filters.sort) qs.sort = filters.sort;
						if (filters.call_type) qs.call_type = filters.call_type;
						if (filters.call_status) qs.call_status = filters.call_status;
						if (typeof filters.is_outbound === 'boolean') qs.is_outbound = filters.is_outbound;
						if (filters.phone_number) qs.phone_number = filters.phone_number;
						if (filters.contact_id) qs.contact_id = filters.contact_id;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'yourangApi',
							{
								method: 'GET',
								url: `${baseUrl}/call-history`,
								qs,
							}
						);
					}

					if (operation === 'getTranscript') {
						const callId = this.getNodeParameter('callId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'yourangApi',
							{
								method: 'GET',
								url: `${baseUrl}/call-history/${callId}/transcript`,
							}
						);
					}
				}

				// Contact operations
				if (resource === 'contact') {
					if (operation === 'create') {
						const body: any = {
							first_name: this.getNodeParameter('first_name', i),
							phone_number: this.getNodeParameter('phone_number', i),
						};

						// Add optional fields
						const lastName = this.getNodeParameter('last_name', i) as string;
						const email = this.getNodeParameter('email', i) as string;
						const address = this.getNodeParameter('address', i) as string;

						if (lastName) body.last_name = lastName;
						if (email) body.email = email;
						if (address) body.address = address;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'yourangApi',
							{
								method: 'POST',
								url: `${baseUrl}/contacts`,
								body,
							}
						);
					}

					if (operation === 'update') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						const body: any = {};

						// Add all fields that are provided
						const firstName = this.getNodeParameter('first_name', i) as string;
						const lastName = this.getNodeParameter('last_name', i) as string;
						const phoneNumber = this.getNodeParameter('phone_number', i) as string;
						const email = this.getNodeParameter('email', i) as string;
						const address = this.getNodeParameter('address', i) as string;

						if (firstName) body.first_name = firstName;
						if (lastName) body.last_name = lastName;
						if (phoneNumber) body.phone_number = phoneNumber;
						if (email) body.email = email;
						if (address) body.address = address;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'yourangApi',
							{
								method: 'PUT',
								url: `${baseUrl}/contacts/${contactId}`,
								body,
							}
						);
					}

					if (operation === 'get') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'yourangApi',
							{
								method: 'GET',
								url: `${baseUrl}/contacts/${contactId}`,
							}
						);
					}

					if (operation === 'delete') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'yourangApi',
							{
								method: 'DELETE',
								url: `${baseUrl}/contacts/${contactId}`,
							}
						);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as any;

						let qs: any = {};

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
						}

						// Add filters
						if (filters.search) qs.search = filters.search;
						if (filters.sort) qs.sort = filters.sort;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'yourangApi',
							{
								method: 'GET',
								url: `${baseUrl}/contacts`,
								qs,
							}
						);
					}

					if (operation === 'getByPhone') {
						const phoneNumber = this.getNodeParameter('phoneNumberLookup', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'yourangApi',
							{
								method: 'GET',
								url: `${baseUrl}/contacts/by-phone/${encodeURIComponent(phoneNumber)}`,
							}
						);
					}

					if (operation === 'updateByPhone') {
						const phoneNumber = this.getNodeParameter('phoneNumberLookup', i) as string;
						const body: any = {};

						// Add all fields that are provided
						const firstName = this.getNodeParameter('first_name', i) as string;
						const lastName = this.getNodeParameter('last_name', i) as string;
						const newPhoneNumber = this.getNodeParameter('phone_number', i) as string;
						const email = this.getNodeParameter('email', i) as string;
						const address = this.getNodeParameter('address', i) as string;

						if (firstName) body.first_name = firstName;
						if (lastName) body.last_name = lastName;
						if (newPhoneNumber) body.phone_number = newPhoneNumber;
						if (email) body.email = email;
						if (address) body.address = address;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'yourangApi',
							{
								method: 'PUT',
								url: `${baseUrl}/contacts/by-phone/${encodeURIComponent(phoneNumber)}`,
								body,
							}
						);
					}

					if (operation === 'deleteByPhone') {
						const phoneNumber = this.getNodeParameter('phoneNumberLookup', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'yourangApi',
							{
								method: 'DELETE',
								url: `${baseUrl}/contacts/by-phone/${encodeURIComponent(phoneNumber)}`,
							}
						);
					}
				}

				// Action operations
				if (resource === 'action') {
					if (operation === 'listActions') {
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'yourangApi',
							{
								method: 'GET',
								url: `${baseUrl}/actions/`,
							}
						);
					}

					if (operation === 'executeSingle') {
						const configurationId = this.getNodeParameter('configurationId', i) as string;
						const toNumber = this.getNodeParameter('to_number', i) as string;

						const body = {
							to_number: toNumber,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'yourangApi',
							{
								method: 'POST',
								url: `${baseUrl}/actions/${configurationId}/execute`,
								body,
							}
						);
					}

					if (operation === 'executeBatchNumbers') {
						const configurationId = this.getNodeParameter('configurationId', i) as string;
						const toNumbersString = this.getNodeParameter('to_numbers', i) as string;
						
						// Convert string to array (split by lines and filter empty)
						const toNumbers = toNumbersString.split('\n').map(num => num.trim()).filter(num => num);

						const body = {
							to_numbers: toNumbers,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'yourangApi',
							{
								method: 'POST',
								url: `${baseUrl}/actions/${configurationId}/batch/numbers`,
								body,
							}
						);
					}

					if (operation === 'executeBatchContacts') {
						const configurationId = this.getNodeParameter('configurationId', i) as string;
						const contactIdsString = this.getNodeParameter('contact_ids', i) as string;
						
						// Convert string to array (split by lines and filter empty)
						const contactIds = contactIdsString.split('\n').map(id => id.trim()).filter(id => id);

						const body = {
							contact_ids: contactIds,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'yourangApi',
							{
								method: 'POST',
								url: `${baseUrl}/actions/${configurationId}/batch/contacts`,
								body,
							}
						);
					}

					if (operation === 'getActionHistory') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as any;

						let qs: any = {};

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
						}

						// Add filters
						if (filters.configuration_id) qs.configuration_id = filters.configuration_id;
						if (filters.batch_id) qs.batch_id = filters.batch_id;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'yourangApi',
							{
								method: 'GET',
								url: `${baseUrl}/actions/history`,
								qs,
							}
						);
					}

					if (operation === 'getActionHistoryDetails') {
						const actionHistoryId = this.getNodeParameter('actionHistoryId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'yourangApi',
							{
								method: 'GET',
								url: `${baseUrl}/actions/history/${actionHistoryId}`,
							}
						);
					}

					if (operation === 'getBatchHistory') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						let qs: any = {};

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'yourangApi',
							{
								method: 'GET',
								url: `${baseUrl}/actions/batch-history`,
								qs,
							}
						);
					}

					if (operation === 'getBatchHistoryDetails') {
						const batchExecuteId = this.getNodeParameter('batchExecuteId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'yourangApi',
							{
								method: 'GET',
								url: `${baseUrl}/actions/batch-history/${batchExecuteId}`,
							}
						);
					}
				}

				// Event operations
				if (resource === 'event') {
					if (operation === 'get') {
						const eventId = this.getNodeParameter('eventId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'yourangApi',
							{
								method: 'GET',
								url: `${baseUrl}/events/${eventId}`,
							}
						);
					}

					if (operation === 'getAll') {
						let qs: any = {};

						const eventsPerDay = this.getNodeParameter('eventsPerDay', i) as number;
						if (eventsPerDay) qs.events_per_day = eventsPerDay;

						const startDate = this.getNodeParameter('startDate', i) as string;
						const endDate = this.getNodeParameter('endDate', i) as string;
						if (startDate) qs.start_date = startDate.split('T')[0]; // Extract date part
						if (endDate) qs.end_date = endDate.split('T')[0]; // Extract date part

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'yourangApi',
							{
								method: 'GET',
								url: `${baseUrl}/events`,
								qs,
							}
						);
					}

					if (operation === 'getByDate') {
						const targetDate = this.getNodeParameter('targetDate', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						let qs: any = {
							target_date: targetDate.split('T')[0], // Extract date part
						};

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'yourangApi',
							{
								method: 'GET',
								url: `${baseUrl}/events/date`,
								qs,
							}
						);
					}

					if (operation === 'update') {
						const eventId = this.getNodeParameter('eventId', i) as string;
						const body: any = {};

						// Add all fields that are provided
						const clientFullName = this.getNodeParameter('client_full_name', i) as string;
						const clientEmail = this.getNodeParameter('client_email', i) as string;
						const clientPhoneNumber = this.getNodeParameter('client_phone_number', i) as string;
						const details = this.getNodeParameter('details', i) as string;
						const startingDate = this.getNodeParameter('starting_date', i) as string;
						const endingDate = this.getNodeParameter('ending_date', i) as string;
						const status = this.getNodeParameter('status', i) as string;

						if (clientFullName) body.client_full_name = clientFullName;
						if (clientEmail) body.client_email = clientEmail;
						if (clientPhoneNumber) body.client_phone_number = clientPhoneNumber;
						if (details) body.details = details;
						if (startingDate) body.starting_date = startingDate;
						if (endingDate) body.ending_date = endingDate;
						if (status) body.status = status;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'yourangApi',
							{
								method: 'PUT',
								url: `${baseUrl}/events/${eventId}`,
								body,
							}
						);
					}

					if (operation === 'updateStatus') {
						const eventId = this.getNodeParameter('eventId', i) as string;
						const isApproved = this.getNodeParameter('isApproved', i) as boolean;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'yourangApi',
							{
								method: 'PATCH',
								url: `${baseUrl}/events/${eventId}/status`,
								qs: {
									is_approved: isApproved,
								},
							}
						);
					}

					if (operation === 'delete') {
						const eventId = this.getNodeParameter('eventId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'yourangApi',
							{
								method: 'DELETE',
								url: `${baseUrl}/events/${eventId}`,
							}
						);
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					[{ json: responseData }],
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						[{ json: { error: error.message } }],
						{ itemData: { item: i } },
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}
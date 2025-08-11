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
		description: 'Interact with Yourang.ai - 24/7 AI phone assistant',
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
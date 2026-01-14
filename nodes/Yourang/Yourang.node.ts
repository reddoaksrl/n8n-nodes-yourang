import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { yourangOperations, yourangFields } from './YourangDescription';
import { BaseResourceHandler } from './resources/BaseResourceHandler';
import { CallHistoryHandler } from './resources/CallHistoryHandler';
import { ContactHandler } from './resources/ContactHandler';
import { ActionHandler } from './resources/ActionHandler';
import { EventHandler } from './resources/EventHandler';
import { AgentHandler } from './resources/AgentHandler';
import { AgentToolHandler } from './resources/AgentToolHandler';

/**
 * Get the appropriate handler for a resource
 */
function getResourceHandler(
	resource: string,
	context: IExecuteFunctions,
	baseUrl: string,
): BaseResourceHandler {
	switch (resource) {
		case 'callHistory':
			return new CallHistoryHandler(context, baseUrl);
		case 'contact':
			return new ContactHandler(context, baseUrl);
		case 'action':
			return new ActionHandler(context, baseUrl);
		case 'event':
			return new EventHandler(context, baseUrl);
		case 'agent':
			return new AgentHandler(context, baseUrl);
		case 'agentTool':
			return new AgentToolHandler(context, baseUrl);
		default:
			throw new NodeOperationError(context.getNode(), `Unknown resource: ${resource}`);
	}
}

export class Yourang implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Yourang',
		name: 'yourang',
		icon: 'file:yourang.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Interact with Yourang.ai - 24/7 AI phone assistant for calls, contacts, actions, and events',
		defaults: {
			name: 'Yourang',
		},
		inputs: ['main'],
		outputs: ['main'],
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
						name: 'Action',
						value: 'action',
						description: 'Execute actions and manage action configurations',
					},
					{
						name: 'Agent',
						value: 'agent',
						description: 'Retrieve and manage AI agents',
					},
					{
						name: 'Agent Tool',
						value: 'agentTool',
						description: 'Manage tools available for an agent',
					},
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

		// Get the appropriate handler
		const handler = getResourceHandler(resource, this, baseUrl);

		// Execute operation for each item
		for (let i = 0; i < items.length; i++) {
			try {
				const responseData = await handler.execute(operation, i);

				const executionData = this.helpers.constructExecutionMetaData([{ json: responseData }], {
					itemData: { item: i },
				});

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

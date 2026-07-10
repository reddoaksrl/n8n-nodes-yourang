import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';
import { yourangOperations, yourangFields } from './YourangDescription';
import { BaseResourceHandler } from './resources/BaseResourceHandler';
import { CallHistoryHandler } from './resources/CallHistoryHandler';
import { ContactHandler } from './resources/ContactHandler';
import { EventHandler } from './resources/EventHandler';
import { AgentHandler } from './resources/AgentHandler';
import { AgentToolHandler } from './resources/AgentToolHandler';
import { WorkflowHandler } from './resources/WorkflowHandler';
import { CampaignHandler } from './resources/CampaignHandler';
import { CatalogueHandler } from './resources/CatalogueHandler';
import { CatalogueItemHandler } from './resources/CatalogueItemHandler';
import { ContactListHandler } from './resources/ContactListHandler';
import { OrderHandler } from './resources/OrderHandler';
import { WalletHandler } from './resources/WalletHandler';

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
		case 'event':
			return new EventHandler(context, baseUrl);
		case 'agent':
			return new AgentHandler(context, baseUrl);
		case 'agentTool':
			return new AgentToolHandler(context, baseUrl);
		case 'workflow':
			return new WorkflowHandler(context, baseUrl);
		case 'campaign':
			return new CampaignHandler(context, baseUrl);
		case 'catalogue':
			return new CatalogueHandler(context, baseUrl);
		case 'catalogueItem':
			return new CatalogueItemHandler(context, baseUrl);
		case 'contactList':
			return new ContactListHandler(context, baseUrl);
		case 'order':
			return new OrderHandler(context, baseUrl);
		case 'wallet':
			return new WalletHandler(context, baseUrl);
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
			'Interact with yourang.ai - 24/7 AI phone assistant for calls, contacts, and events',
		defaults: {
			name: 'Yourang',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'yourangApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
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
						name: 'Campaign',
						value: 'campaign',
						description: 'Manage and control outbound call campaigns',
					},
					{
						name: 'Catalogue',
						value: 'catalogue',
						description: 'Manage product catalogues',
					},
					{
						name: 'Catalogue Item',
						value: 'catalogueItem',
						description: 'Manage catalogue items and products',
					},
					{
						name: 'Contact',
						value: 'contact',
						description: 'Manage customer contacts and information',
					},
					{
						name: 'Contact List',
						value: 'contactList',
						description: 'Manage contact lists and their members',
					},
					{
						name: 'Event',
						value: 'event',
						description: 'Manage calendar events and appointments',
					},
					{
						name: 'Order',
						value: 'order',
						description: 'Retrieve and update customer orders',
					},
					{
						name: 'Wallet',
						value: 'wallet',
						description: 'Retrieve wallet balance and transactions',
					},
					{
						name: 'Workflow',
						value: 'workflow',
						description: 'Manage and execute workflows',
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

		// If no input items, return empty result
		if (items.length === 0) {
			return [returnData];
		}

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

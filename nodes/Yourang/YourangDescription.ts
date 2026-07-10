import { INodeProperties } from 'n8n-workflow';

// Import resource-specific descriptions
import { callHistoryOperations, callHistoryFields } from './descriptions/callHistory.description';

import { contactOperations, contactFields } from './descriptions/contact.description';

import { eventOperations, eventFields } from './descriptions/event.description';

import { agentOperations, agentFields } from './descriptions/agent.description';

import { agentToolOperations, agentToolFields } from './descriptions/agentTool.description';

import { workflowOperations, workflowFields } from './descriptions/workflow.description';

import { campaignOperations, campaignFields } from './descriptions/campaign.description';

import { catalogueOperations, catalogueFields } from './descriptions/catalogue.description';

import {
	catalogueItemOperations,
	catalogueItemFields,
} from './descriptions/catalogueItem.description';

import { contactListOperations, contactListFields } from './descriptions/contactList.description';

import { orderOperations, orderFields } from './descriptions/order.description';

import { walletOperations, walletFields } from './descriptions/wallet.description';

// Combine all operations
export const yourangOperations: INodeProperties[] = [
	...callHistoryOperations,
	...contactOperations,
	...eventOperations,
	...agentOperations,
	...agentToolOperations,
	...workflowOperations,
	...campaignOperations,
	...catalogueOperations,
	...catalogueItemOperations,
	...contactListOperations,
	...orderOperations,
	...walletOperations,
];

// Combine all fields
export const yourangFields: INodeProperties[] = [
	...callHistoryFields,
	...contactFields,
	...eventFields,
	...agentFields,
	...agentToolFields,
	...workflowFields,
	...campaignFields,
	...catalogueFields,
	...catalogueItemFields,
	...contactListFields,
	...orderFields,
	...walletFields,
];

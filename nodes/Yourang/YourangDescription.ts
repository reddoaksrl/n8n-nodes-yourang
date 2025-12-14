import { INodeProperties } from 'n8n-workflow';

// Import resource-specific descriptions
import {
	callHistoryOperations,
	callHistoryFields,
} from './descriptions/callHistory.description';

import {
	contactOperations,
	contactFields,
} from './descriptions/contact.description';

import {
	actionOperations,
	actionFields,
} from './descriptions/action.description';

import {
	eventOperations,
	eventFields,
} from './descriptions/event.description';

// Combine all operations
export const yourangOperations: INodeProperties[] = [
	...callHistoryOperations,
	...contactOperations,
	...actionOperations,
	...eventOperations,
];

// Combine all fields
export const yourangFields: INodeProperties[] = [
	...callHistoryFields,
	...contactFields,
	...actionFields,
	...eventFields,
];

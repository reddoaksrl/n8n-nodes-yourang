import { INodeProperties } from 'n8n-workflow';

export const actionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['action'],
			},
		},
		options: [
			{
				name: 'Execute Batch (Contacts)',
				value: 'executeBatchContacts',
				description: 'Execute batch action with contact IDs (max 50)',
				action: 'Execute batch action with contacts',
			},
			{
				name: 'Execute Batch (Numbers)',
				value: 'executeBatchNumbers',
				description: 'Execute batch action with phone numbers (max 50)',
				action: 'Execute batch action with numbers',
			},
			{
				name: 'Execute Single',
				value: 'executeSingle',
				description: 'Execute an action with single phone number',
				action: 'Execute single action',
			},
			{
				name: 'Get Action History',
				value: 'getActionHistory',
				description: 'Get action execution history',
				action: 'Get action history',
			},
			{
				name: 'Get Action History Details',
				value: 'getActionHistoryDetails',
				description: 'Get details of a specific action execution',
				action: 'Get action history details',
			},
			{
				name: 'Get Batch History',
				value: 'getBatchHistory',
				description: 'Get batch action execution history',
				action: 'Get batch history',
			},
			{
				name: 'Get Batch History Details',
				value: 'getBatchHistoryDetails',
				description: 'Get details of a specific batch execution',
				action: 'Get batch history details',
			},
			{
				name: 'List Available Actions',
				value: 'listActions',
				description: 'List all available action configurations',
				action: 'List available actions',
			},
		],
		default: 'listActions',
	},
];

export const actionFields: INodeProperties[] = [
	{
		displayName: 'Configuration ID',
		name: 'configurationId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['executeSingle', 'executeBatchNumbers', 'executeBatchContacts'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the action configuration to execute',
	},
	{
		displayName: 'Phone Number',
		name: 'to_number',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['executeSingle'],
			},
		},
		default: '',
		required: true,
		description: 'Phone number in E.164 format (e.g., +1234567890)',
	},
	{
		displayName: 'Phone Numbers',
		name: 'to_numbers',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['executeBatchNumbers'],
			},
		},
		default: '',
		required: true,
		description: 'Phone numbers in E.164 format, one per line (max 50)',
	},
	{
		displayName: 'Contact IDs',
		name: 'contact_ids',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['executeBatchContacts'],
			},
		},
		default: '',
		required: true,
		description: 'Contact UUIDs, one per line (max 50)',
	},
	{
		displayName: 'Action History ID',
		name: 'actionHistoryId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['getActionHistoryDetails'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the action execution to retrieve',
	},
	{
		displayName: 'Batch Execute ID',
		name: 'batchExecuteId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['getBatchHistoryDetails'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the batch execution to retrieve',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['getActionHistory', 'getBatchHistory'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['getActionHistory', 'getBatchHistory'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['getActionHistory'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Configuration ID',
				name: 'configuration_id',
				type: 'string',
				default: '',
				description: 'Filter by action configuration ID',
			},
			{
				displayName: 'Batch ID',
				name: 'batch_id',
				type: 'string',
				default: '',
				description: 'Filter by batch execution ID',
			},
		],
	},
];

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
			maxValue: 500,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['getActionHistory'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 0,
		},
		default: 0,
		description: 'Number of records to skip for pagination',
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
				displayName: 'Batch ID',
				name: 'batch_id',
				type: 'string',
				default: '',
				description: 'Filter by batch execution ID',
			},
			{
				displayName: 'Configuration ID',
				name: 'configuration_id',
				type: 'string',
				default: '',
				description: 'Filter by action configuration ID',
			},
			{
				displayName: 'Quality Text',
				name: 'quality_text',
				type: 'options',
				default: '',
				options: [
					{
						name: 'Very Good',
						value: 'very good',
					},
					{
						name: 'Good',
						value: 'good',
					},
					{
						name: 'Neutral',
						value: 'neutral',
					},
					{
						name: 'Bad',
						value: 'bad',
					},
					{
						name: 'Very Bad',
						value: 'very bad',
					},
				],
				description: 'Filter by quality text',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'options',
				default: '',
				options: [
					{
						name: 'Completed At (Ascending)',
						value: 'completed_at',
					},
					{
						name: 'Completed At (Descending)',
						value: '-completed_at',
					},
					{
						name: 'Created At (Ascending)',
						value: 'created_at',
					},
					{
						name: 'Created At (Descending)',
						value: '-created_at',
					},
					{
						name: 'Quality Score (Ascending)',
						value: 'quality_score',
					},
					{
						name: 'Quality Score (Descending)',
						value: '-quality_score',
					},
					{
						name: 'Quality Text (Ascending)',
						value: 'quality_text',
					},
					{
						name: 'Quality Text (Descending)',
						value: '-quality_text',
					},
					{
						name: 'Started At (Ascending)',
						value: 'started_at',
					},
					{
						name: 'Started At (Descending)',
						value: '-started_at',
					},
					{
						name: 'Status (Ascending)',
						value: 'status',
					},
					{
						name: 'Status (Descending)',
						value: '-status',
					},
				],
				description: 'Sort field and order',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: '',
				options: [
					{
						name: 'Pending',
						value: 'pending',
					},
					{
						name: 'Running',
						value: 'running',
					},
					{
						name: 'Completed',
						value: 'completed',
					},
					{
						name: 'Failed',
						value: 'failed',
					},
					{
						name: 'Cancelled',
						value: 'cancelled',
					},
					{
						name: 'Not Answered',
						value: 'not_answered',
					},
					{
						name: 'Rejected',
						value: 'rejected',
					},
				],
				description: 'Filter by execution status',
			},
		],
	},
];

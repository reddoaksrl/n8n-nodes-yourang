import { INodeProperties } from 'n8n-workflow';

// Operations for each resource
export const yourangOperations: INodeProperties[] = [
	// Call History Operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['callHistory'],
			},
		},
		options: [
			{
				name: 'Get Call',
				value: 'get',
				description: 'Get details of a specific call including transcript',
				action: 'Get a call',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many call history records with optional filters',
				action: 'Get many calls',
			},
		],
		default: 'getAll',
	},

	// Contact Operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['contact'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new contact',
				action: 'Create a contact',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a contact',
				action: 'Delete a contact',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get details of a specific contact',
				action: 'Get a contact',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many contacts',
				action: 'Get many contacts',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing contact',
				action: 'Update a contact',
			},
		],
		default: 'getAll',
	},

	// Action Operations
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

// Fields for each operation
export const yourangFields: INodeProperties[] = [
	// Call History Fields
	{
		displayName: 'Call ID',
		name: 'callId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['callHistory'],
				operation: ['get'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the call to retrieve',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['callHistory'],
				operation: ['getAll'],
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
				resource: ['callHistory'],
				operation: ['getAll'],
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
				resource: ['callHistory'],
				operation: ['getAll'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Call Status',
				name: 'call_status',
				type: 'options',
				options: [
					{
						name: 'Completed',
						value: 'Completed',
					},
					{
						name: 'Failed',
						value: 'Failed',
					},
					{
						name: 'In Progress',
						value: 'In Progress',
					},
					{
						name: 'Cancelled',
						value: 'Cancelled',
					},
				],
				default: 'Completed',
				description: 'Filter by call status',
			},
			{
				displayName: 'Call Type',
				name: 'call_type',
				type: 'options',
				options: [
					{
						name: 'Automated',
						value: 'Automated',
					},
					{
						name: 'Manual',
						value: 'Manual',
					},
					{
						name: 'Transferred',
						value: 'Transferred',
					},
				],
				default: 'Automated',
				description: 'Filter by call type',
			},
			{
				displayName: 'Contact ID',
				name: 'contact_id',
				type: 'string',
				default: '',
				description: 'Filter by contact ID',
			},
			{
				displayName: 'Is Outbound',
				name: 'is_outbound',
				type: 'boolean',
				default: true,
				description: 'Whether to filter for outbound calls (true) or inbound calls (false)',
			},
			{
				displayName: 'Phone Number',
				name: 'phone_number',
				type: 'string',
				default: '',
				description: 'Filter by any phone number (from_number or to_number)',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'options',
				options: [
					{
						name: 'Duration (Ascending)',
						value: 'duration',
					},
					{
						name: 'Duration (Descending)',
						value: '-duration',
					},
					{
						name: 'End Time (Ascending)',
						value: 'end_time',
					},
					{
						name: 'End Time (Descending)',
						value: '-end_time',
					},
					{
						name: 'Start Time (Ascending)',
						value: 'start_time',
					},
					{
						name: 'Start Time (Descending)',
						value: '-start_time',
					},
				],
				default: '-start_time',
				description: 'Sort field and order',
			},
		],
	},

	// Contact Fields
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the contact',
	},
	{
		displayName: 'First Name',
		name: 'first_name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		required: true,
		description: 'Contact\'s first name',
	},
	{
		displayName: 'Phone Number',
		name: 'phone_number',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		required: true,
		description: 'Contact\'s phone number in E.164 format (e.g., +1234567890)',
	},
	{
		displayName: 'Last Name',
		name: 'last_name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Contact\'s last name (optional)',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Contact\'s email address (optional)',
	},
	{
		displayName: 'Address',
		name: 'address',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Contact\'s address (optional)',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['getAll'],
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
				resource: ['contact'],
				operation: ['getAll'],
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
				resource: ['contact'],
				operation: ['getAll'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Search in first_name, last_name, or email',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'options',
				options: [
					{
						name: 'Created At (Ascending)',
						value: 'created_at',
					},
					{
						name: 'Created At (Descending)',
						value: '-created_at',
					},
					{
						name: 'Email (Ascending)',
						value: 'email',
					},
					{
						name: 'Email (Descending)',
						value: '-email',
					},
					{
						name: 'First Name (Ascending)',
						value: 'first_name',
					},
					{
						name: 'First Name (Descending)',
						value: '-first_name',
					},
					{
						name: 'Last Name (Ascending)',
						value: 'last_name',
					},
					{
						name: 'Last Name (Descending)',
						value: '-last_name',
					},
				],
				default: '-created_at',
				description: 'Sort field and order',
			},
		],
	},

	// Action Fields
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
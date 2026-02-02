import { INodeProperties } from 'n8n-workflow';

export const workflowOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['workflow'],
			},
		},
		options: [
			{
				name: 'Execute',
				value: 'execute',
				description: 'Execute a workflow',
				action: 'Execute a workflow',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get workflow details',
				action: 'Get workflow details',
			},
			{
				name: 'Get Execution Details',
				value: 'getExecutionDetails',
				action: 'Get execution details',
			},
			{
				name: 'Get Executions',
				value: 'getExecutions',
				description: 'List workflow executions',
				action: 'List workflow executions',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'List many workflows',
				action: 'List all workflows',
			},
		],
		default: 'getAll',
	},
];

export const workflowFields: INodeProperties[] = [
	// ========================================
	// Fields for Get All operation
	// ========================================
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['workflow'],
				operation: ['getAll', 'getExecutions'],
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
				resource: ['workflow'],
				operation: ['getAll', 'getExecutions'],
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
				resource: ['workflow'],
				operation: ['getAll'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Display Name',
				name: 'display_name',
				type: 'string',
				default: '',
				description: 'Filter by workflow display name (substring match)',
			},
			{
				displayName: 'Is Enabled',
				name: 'is_enabled',
				type: 'boolean',
				default: true,
				description: 'Whether to filter by enabled workflows only',
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
						name: 'Display Name (Ascending)',
						value: 'display_name',
					},
					{
						name: 'Display Name (Descending)',
						value: '-display_name',
					},
					{
						name: 'Version (Ascending)',
						value: 'version',
					},
					{
						name: 'Version (Descending)',
						value: '-version',
					},
				],
				default: '-created_at',
				description: 'Sort field and order',
			},
		],
	},
	{
		displayName: 'Advanced Filter Query',
		name: 'advancedFilter',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['workflow'],
				operation: ['getAll'],
			},
		},
		default: '',
		placeholder: 'display_name:My Workflow&is_enabled:true',
		description: 'Advanced filter query with AND (&) operators. Overrides simple filters if provided.',
		hint: 'Format: field:value&field:value',
	},

	// ========================================
	// Fields for Get operation
	// ========================================
	{
		displayName: 'Workflow ID',
		name: 'workflowId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['workflow'],
				operation: ['get', 'execute', 'getExecutions', 'getExecutionDetails'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the workflow',
	},

	// ========================================
	// Fields for Execute operation
	// ========================================
	{
		displayName: 'To Number',
		name: 'to_number',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['workflow'],
				operation: ['execute'],
			},
		},
		default: '',
		placeholder: '+393348470651',
		description: 'Phone number to call',
		required: true,
	},

	// ========================================
	// Fields for Get Executions operation
	// ========================================
	{
		displayName: 'Filters',
		name: 'executionFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['workflow'],
				operation: ['getExecutions'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				default: 0,
				typeOptions: {
					minValue: 0,
				},
				description: 'Number of executions to skip for pagination',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Cancelled',
						value: 'cancelled',
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
						name: 'Pending',
						value: 'pending',
					},
					{
						name: 'Running',
						value: 'running',
					},
					{
						name: 'Timed Out',
						value: 'timed_out',
					},
				],
				default: 'pending',
				description: 'Filter by execution status',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{
						name: 'API',
						value: 'api',
					},
					{
						name: 'Campaign',
						value: 'campaign',
					},
					{
						name: 'Manual',
						value: 'manual',
					},
					{
						name: 'Scheduled',
						value: 'scheduled',
					},
					{
						name: 'Triggered',
						value: 'triggered',
					},
				],
				default: 'api',
				description: 'Filter by execution type',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'options',
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
				default: '-created_at',
				description: 'Sort field and order',
			},
		],
	},

	// ========================================
	// Fields for Get Execution Details operation
	// ========================================
	{
		displayName: 'Execution ID',
		name: 'executionId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['workflow'],
				operation: ['getExecutionDetails'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the execution',
	},
];

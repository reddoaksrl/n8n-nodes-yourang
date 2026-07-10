import { INodeProperties } from 'n8n-workflow';

export const campaignOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['campaign'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get details of a specific campaign',
				action: 'Get a campaign',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many campaigns for the authenticated organization',
				action: 'Get many campaigns',
			},
			{
				name: 'Get Stats',
				value: 'getStats',
				description: 'Get statistics for a specific campaign',
				action: 'Get campaign stats',
			},
			{
				name: 'Pause',
				value: 'pause',
				description: 'Pause a running campaign',
				action: 'Pause a campaign',
			},
			{
				name: 'Resume',
				value: 'resume',
				description: 'Resume a paused campaign',
				action: 'Resume a campaign',
			},
			{
				name: 'Start',
				value: 'start',
				description: 'Start a campaign',
				action: 'Start a campaign',
			},
			{
				name: 'Stop',
				value: 'stop',
				description: 'Stop a campaign',
				action: 'Stop a campaign',
			},
		],
		default: 'getAll',
	},
];

export const campaignFields: INodeProperties[] = [
	// ========================================
	// Fields for Get Many operation
	// ========================================
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['campaign'],
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
				resource: ['campaign'],
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
				resource: ['campaign'],
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
				description: 'Filter campaigns by name (case-insensitive substring match)',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Completed',
						value: 'completed',
					},
					{
						name: 'Draft',
						value: 'draft',
					},
					{
						name: 'Failed',
						value: 'failed',
					},
					{
						name: 'Paused',
						value: 'paused',
					},
					{
						name: 'Running',
						value: 'running',
					},
					{
						name: 'Scheduled',
						value: 'scheduled',
					},
					{
						name: 'Stopped',
						value: 'stopped',
					},
				],
				default: 'running',
				description: 'Filter by campaign status',
			},
		],
	},

	// ========================================
	// Shared field for operations that need a Campaign ID
	// ========================================
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['get', 'getStats', 'pause', 'resume', 'start', 'stop'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the campaign',
	},
];

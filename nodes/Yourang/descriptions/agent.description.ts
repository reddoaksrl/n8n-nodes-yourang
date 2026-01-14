import { INodeProperties } from 'n8n-workflow';

export const agentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['agent'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get details of a specific agent',
				action: 'Get an agent',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many agents for the authenticated organization',
				action: 'Get many agents',
			},
		],
		default: 'getAll',
	},
];

export const agentFields: INodeProperties[] = [
	{
		displayName: 'Agent ID',
		name: 'agentId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['get'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the agent to retrieve',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['agent'],
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
				resource: ['agent'],
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
				resource: ['agent'],
				operation: ['getAll'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Agent Type',
				name: 'agent_type',
				type: 'options',
				options: [
					{
						name: 'Inbound',
						value: 'inbound',
					},
					{
						name: 'Outbound',
						value: 'outbound',
					},
				],
				default: 'inbound',
				description: 'Filter agents by type (inbound or outbound)',
			},
		],
	},
];

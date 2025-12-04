import { INodeProperties } from 'n8n-workflow';

export const callHistoryOperations: INodeProperties[] = [
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
			{
				name: 'Get Transcript',
				value: 'getTranscript',
				description: 'Get the transcript for a specific call',
				action: 'Get call transcript',
			},
			{
				name: 'Get Summary',
				value: 'getSummary',
				description: 'Get AI-generated summary for a specific call',
				action: 'Get call summary',
			},
		],
		default: 'getAll',
	},
];

export const callHistoryFields: INodeProperties[] = [
	{
		displayName: 'Call ID',
		name: 'callId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['callHistory'],
				operation: ['get', 'getTranscript', 'getSummary'],
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
];

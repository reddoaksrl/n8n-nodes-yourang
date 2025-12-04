import { INodeProperties } from 'n8n-workflow';

export const eventOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['event'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an event',
				action: 'Delete an event',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get details of a specific event',
				action: 'Get an event',
			},
			{
				name: 'Get by Date',
				value: 'getByDate',
				description: 'Get events for a specific date',
				action: 'Get events by date',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get events grouped by date',
				action: 'Get many events',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing event',
				action: 'Update an event',
			},
			{
				name: 'Update Status',
				value: 'updateStatus',
				description: 'Approve or reject an event',
				action: 'Update event status',
			},
		],
		default: 'getAll',
	},
];

export const eventFields: INodeProperties[] = [
	{
		displayName: 'Event ID',
		name: 'eventId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['get', 'update', 'updateStatus', 'delete'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the event',
	},
	{
		displayName: 'Target Date',
		name: 'targetDate',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['getByDate'],
			},
		},
		default: '',
		required: true,
		description: 'Target date to get events for (YYYY-MM-DD format)',
	},
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['getAll'],
			},
		},
		default: '',
		description: 'Start date for event range (YYYY-MM-DD)',
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['getAll'],
			},
		},
		default: '',
		description: 'End date for event range (YYYY-MM-DD)',
	},
	{
		displayName: 'Events Per Day',
		name: 'eventsPerDay',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['getAll'],
			},
		},
		default: 50,
		description: 'Maximum number of events to show per day',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['getByDate'],
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
				resource: ['event'],
				operation: ['getByDate'],
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
		displayName: 'Client Full Name',
		name: 'client_full_name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Client\'s full name (optional)',
	},
	{
		displayName: 'Client Email',
		name: 'client_email',
		type: 'string',
		placeholder: 'name@email.com',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Client\'s email address (optional)',
	},
	{
		displayName: 'Client Phone Number',
		name: 'client_phone_number',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Client\'s phone number (optional)',
	},
	{
		displayName: 'Details',
		name: 'details',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Event details (optional)',
	},
	{
		displayName: 'Starting Date',
		name: 'starting_date',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Event start date and time (optional)',
	},
	{
		displayName: 'Ending Date',
		name: 'ending_date',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Event end date and time (optional)',
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		options: [
			{
				name: 'Approved',
				value: 'APPROVED',
			},
			{
				name: 'Confirmed',
				value: 'CONFIRMED',
			},
			{
				name: 'Pending',
				value: 'PENDING',
			},
			{
				name: 'Pending Deletion',
				value: 'PENDING_DELETION',
			},
			{
				name: 'Rejected',
				value: 'REJECTED',
			},
		],
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['update'],
			},
		},
		default: 'PENDING',
		description: 'Event status (optional)',
	},
	{
		displayName: 'Is Approved',
		name: 'isApproved',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['updateStatus'],
			},
		},
		default: true,
		required: true,
		description: 'Whether to approve or reject (true to approve, false to reject)',
	},
];

import { INodeProperties } from 'n8n-workflow';

export const contactOperations: INodeProperties[] = [
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
				name: 'Delete by Phone',
				value: 'deleteByPhone',
				description: 'Delete a contact by phone number',
				action: 'Delete contact by phone',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get details of a specific contact',
				action: 'Get a contact',
			},
			{
				name: 'Get by Phone',
				value: 'getByPhone',
				description: 'Get a contact by phone number',
				action: 'Get contact by phone',
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
			{
				name: 'Update by Phone',
				value: 'updateByPhone',
				description: 'Update a contact by phone number',
				action: 'Update contact by phone',
			},
		],
		default: 'getAll',
	},
];

export const contactFields: INodeProperties[] = [
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
		displayName: 'Phone Number',
		name: 'phoneNumberLookup',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['getByPhone', 'updateByPhone', 'deleteByPhone'],
			},
		},
		default: '',
		required: true,
		description: 'The phone number of the contact in E.164 format (e.g., +1234567890)',
	},
	{
		displayName: 'First Name',
		name: 'first_name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'Contact\'s first name',
	},
	{
		displayName: 'First Name',
		name: 'first_name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['update', 'updateByPhone'],
			},
		},
		default: '',
		description: 'Contact\'s first name (optional)',
	},
	{
		displayName: 'Phone Number',
		name: 'phone_number',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'Contact\'s phone number in E.164 format (e.g., +1234567890)',
	},
	{
		displayName: 'Phone Number',
		name: 'phone_number',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['update', 'updateByPhone'],
			},
		},
		default: '',
		description: 'New phone number in E.164 format (optional, leave empty to keep current)',
	},
	{
		displayName: 'Last Name',
		name: 'last_name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create', 'update', 'updateByPhone'],
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
				operation: ['create', 'update', 'updateByPhone'],
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
				operation: ['create', 'update', 'updateByPhone'],
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
		displayName: 'Search',
		name: 'search',
		type: 'collection',
		placeholder: 'Add Search Field',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['getAll'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Combine',
				name: 'combineOperation',
				type: 'options',
				options: [
					{
						name: 'AND',
						value: '&',
						description: 'All conditions must match',
					},
					{
						name: 'OR',
						value: '|',
						description: 'At least one condition must match',
					},
				],
				default: '&',
				description: 'How to combine multiple search conditions',
			},
			{
				displayName: 'First Name',
				name: 'first_name',
				type: 'string',
				default: '',
				description: 'Filter by first name',
			},
			{
				displayName: 'Last Name',
				name: 'last_name',
				type: 'string',
				default: '',
				description: 'Filter by last name',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				description: 'Filter by email address',
			},
			{
				displayName: 'Phone Number',
				name: 'phone_number',
				type: 'string',
				default: '',
				description: 'Filter by phone number',
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
	{
		displayName: 'Advanced Filter Query',
		name: 'advancedFilter',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['getAll'],
			},
		},
		default: '',
		placeholder: 'first_name:John|last_name:Doe&email:test@test.com',
		description: 'Advanced filter query with OR (|) and AND (&) operators. Overrides simple filters if provided.',
		hint: 'Format: field:value|field:value&field:value',
	},
];

import { INodeProperties } from 'n8n-workflow';

export const catalogueOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['catalogue'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a catalogue',
				action: 'Create a catalogue',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a catalogue',
				action: 'Delete a catalogue',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get details of a specific catalogue',
				action: 'Get a catalogue',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many catalogues for the authenticated organization',
				action: 'Get many catalogues',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing catalogue',
				action: 'Update a catalogue',
			},
		],
		default: 'getAll',
	},
];

export const catalogueFields: INodeProperties[] = [
	// ========================================
	// Shared field for operations that need a Catalogue ID
	// ========================================
	{
		displayName: 'Catalogue ID',
		name: 'catalogueId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalogue'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the catalogue',
	},

	// ========================================
	// Fields for Create operation
	// ========================================
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalogue'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'Name of the catalogue',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalogue'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Description of the catalogue (optional)',
	},
	{
		displayName: 'Initial Items',
		name: 'initialItems',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['catalogue'],
				operation: ['create'],
			},
		},
		default: '[]',
		description: 'Optional JSON array of item objects to add when the catalogue is created, where each object can include sku, name (required), description, price, currency, quantity, and category',
	},

	// ========================================
	// Fields for Delete operation
	// ========================================
	{
		displayName: 'Preserve Items',
		name: 'preserveItems',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['catalogue'],
				operation: ['delete'],
			},
		},
		default: false,
		description: 'Whether items in the catalogue become standalone instead of being deleted',
	},

	// ========================================
	// Fields for Get Many operation
	// ========================================
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['catalogue'],
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
				resource: ['catalogue'],
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
				resource: ['catalogue'],
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
				description: 'Filter catalogues by name (case-insensitive substring match)',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'options',
				options: [
					{
						name: 'Created At',
						value: 'created_at',
					},
					{
						name: 'Created At (Descending)',
						value: '-created_at',
					},
					{
						name: 'Name',
						value: 'name',
					},
					{
						name: 'Name (Descending)',
						value: '-name',
					},
				],
				default: '-created_at',
				description: 'Sort field and order',
			},
		],
	},

	// ========================================
	// Fields for Update operation
	// ========================================
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['catalogue'],
				operation: ['update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'New description for the catalogue',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the catalogue',
			},
		],
	},
];

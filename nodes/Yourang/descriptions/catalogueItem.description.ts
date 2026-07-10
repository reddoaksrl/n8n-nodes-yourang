import { INodeProperties } from 'n8n-workflow';

export const catalogueItemOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['catalogueItem'],
			},
		},
		options: [
			{
				name: 'Assign',
				value: 'assign',
				description: 'Assign items to a catalogue or unassign them',
				action: 'Assign catalogue items',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a catalogue item',
				action: 'Create a catalogue item',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a catalogue item',
				action: 'Delete a catalogue item',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get details of a specific catalogue item',
				action: 'Get a catalogue item',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many catalogue items for the authenticated organization',
				action: 'Get many catalogue items',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing catalogue item',
				action: 'Update a catalogue item',
			},
		],
		default: 'getAll',
	},
];

export const catalogueItemFields: INodeProperties[] = [
	// ========================================
	// Shared field for operations that need an Item ID
	// ========================================
	{
		displayName: 'Item ID',
		name: 'itemId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalogueItem'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the catalogue item',
	},

	// ========================================
	// Fields for Assign operation
	// ========================================
	{
		displayName: 'Item IDs',
		name: 'itemIds',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalogueItem'],
				operation: ['assign'],
			},
		},
		default: '',
		required: true,
		description: 'IDs of the items to assign, separated by commas',
	},
	{
		displayName: 'Catalogue ID',
		name: 'catalogueId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalogueItem'],
				operation: ['assign'],
			},
		},
		default: '',
		description: 'Catalogue to assign the items to; leave empty to unassign the items and make them standalone',
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
				resource: ['catalogueItem'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'Name of the catalogue item',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['catalogueItem'],
				operation: ['create'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Catalogue ID',
				name: 'catalogue_id',
				type: 'string',
				default: '',
				description: 'Catalogue to add the item to; leave empty to create a standalone item',
			},
			{
				displayName: 'Category',
				name: 'category',
				type: 'string',
				default: '',
				description: 'Category of the item',
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: '',
				description: 'Currency code for the price (e.g. EUR or USD)',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the item',
			},
			{
				displayName: 'Price',
				name: 'price',
				type: 'string',
				default: '',
				description: 'Price of the item',
			},
			{
				displayName: 'Quantity',
				name: 'quantity',
				type: 'number',
				default: 0,
				description: 'Available quantity of the item',
			},
			{
				displayName: 'SKU',
				name: 'sku',
				type: 'string',
				default: '',
				description: 'Stock keeping unit; auto-generated when omitted',
			},
		],
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
				resource: ['catalogueItem'],
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
				resource: ['catalogueItem'],
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
				resource: ['catalogueItem'],
				operation: ['getAll'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Catalogue ID',
				name: 'catalogue_id',
				type: 'string',
				default: '',
				description: 'Filter items by the catalogue they belong to',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Filter items by name, SKU, or description (case-insensitive substring match)',
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
					{
						name: 'Price',
						value: 'price',
					},
					{
						name: 'Price (Descending)',
						value: '-price',
					},
				],
				default: '-created_at',
				description: 'Sort field and order',
			},
			{
				displayName: 'Standalone Only',
				name: 'standalone_only',
				type: 'boolean',
				default: false,
				description: 'Whether to return only standalone items that are not assigned to any catalogue',
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
				resource: ['catalogueItem'],
				operation: ['update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Category',
				name: 'category',
				type: 'string',
				default: '',
				description: 'New category for the item',
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: '',
				description: 'New currency code for the price (e.g. EUR or USD)',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'New description for the item',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the item',
			},
			{
				displayName: 'Price',
				name: 'price',
				type: 'string',
				default: '',
				description: 'New price for the item',
			},
			{
				displayName: 'Quantity',
				name: 'quantity',
				type: 'number',
				default: 0,
				description: 'New available quantity for the item',
			},
			{
				displayName: 'SKU',
				name: 'sku',
				type: 'string',
				default: '',
				description: 'New stock keeping unit for the item',
			},
		],
	},
];

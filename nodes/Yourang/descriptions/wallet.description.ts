import { INodeProperties } from 'n8n-workflow';

export const walletOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['wallet'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get the wallet snapshot for the authenticated organization',
				action: 'Get the wallet',
			},
			{
				name: 'Get Many Transactions',
				value: 'getTransactions',
				description: 'Get many wallet transactions for the authenticated organization',
				action: 'Get many wallet transactions',
			},
		],
		default: 'get',
	},
];

export const walletFields: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['wallet'],
				operation: ['getTransactions'],
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
				resource: ['wallet'],
				operation: ['getTransactions'],
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
				resource: ['wallet'],
				operation: ['getTransactions'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Created After',
				name: 'created_after',
				type: 'dateTime',
				default: '',
				description: 'Only transactions created on or after this ISO-8601 datetime',
			},
			{
				displayName: 'Transaction Type',
				name: 'transaction_type',
				type: 'options',
				options: [
					{
						name: 'Add',
						value: 'ADD',
					},
					{
						name: 'Consume',
						value: 'CONSUME',
					},
				],
				default: 'ADD',
				description: 'Filter by transaction direction',
			},
		],
	},
];

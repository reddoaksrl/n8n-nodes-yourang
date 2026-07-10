import { INodeProperties } from 'n8n-workflow';

export const contactListOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['contactList'],
			},
		},
		options: [
			{
				name: 'Add Contacts',
				value: 'addContacts',
				description: 'Add contacts to a contact list by ID or phone number',
				action: 'Add contacts to a contact list',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get details of a specific contact list',
				action: 'Get a contact list',
			},
			{
				name: 'Get Contacts',
				value: 'getContacts',
				description: 'Get the contacts belonging to a contact list',
				action: 'Get contacts of a contact list',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many contact lists',
				action: 'Get many contact lists',
			},
			{
				name: 'Remove Contacts',
				value: 'removeContacts',
				description: 'Remove contacts from a contact list by ID or phone number',
				action: 'Remove contacts from a contact list',
			},
		],
		default: 'getAll',
	},
];

export const contactListFields: INodeProperties[] = [
	{
		displayName: 'Contact List ID',
		name: 'contactListId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['contactList'],
				operation: ['addContacts', 'get', 'getContacts', 'removeContacts'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the contact list',
	},
	{
		displayName: 'Contact IDs',
		name: 'contactIds',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['contactList'],
				operation: ['addContacts', 'removeContacts'],
			},
		},
		default: '',
		placeholder: 'e.g. 1a2b3c4d-0000-0000-0000-000000000001,1a2b3c4d-0000-0000-0000-000000000002',
		description:
			'Comma-separated list of contact IDs (UUIDs). Provide at least one contact ID or phone number. Maximum 500 entries per request.',
	},
	{
		displayName: 'Phone Numbers',
		name: 'phoneNumbers',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['contactList'],
				operation: ['addContacts', 'removeContacts'],
			},
		},
		default: '',
		placeholder: 'e.g. +1234567890,+1987654321',
		description:
			'Comma-separated list of phone numbers in E.164 format. Provide at least one contact ID or phone number. Maximum 500 entries per request.',
	},
	{
		displayName: 'Auto Create',
		name: 'autoCreate',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['contactList'],
				operation: ['addContacts'],
			},
		},
		default: false,
		description:
			'Whether phone numbers that do not match any existing contact are automatically created as new contacts',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['contactList'],
				operation: ['getAll', 'getContacts'],
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
				resource: ['contactList'],
				operation: ['getAll', 'getContacts'],
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
				resource: ['contactList'],
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
				description: 'Partial case-insensitive match on the contact list name',
			},
		],
	},
];

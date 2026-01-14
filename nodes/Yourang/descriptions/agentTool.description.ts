import { INodeProperties } from 'n8n-workflow';

export const agentToolOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['agentTool'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get detailed configuration for a specific tool',
				action: 'Get a tool',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many tools available for a specific agent',
				action: 'Get many tools',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update configuration for a specific agent tool',
				action: 'Update a tool',
			},
		],
		default: 'getAll',
	},
];

export const agentToolFields: INodeProperties[] = [
	{
		displayName: 'Agent ID',
		name: 'agentId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['agentTool'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the agent',
	},
	{
		displayName: 'Tool Name',
		name: 'toolName',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['agentTool'],
				operation: ['get', 'update'],
			},
		},
		options: [
			{
				name: 'End the Call',
				value: 'end-the-call',
			},
			{
				name: 'Make Reservation',
				value: 'make-reservation',
			},
			{
				name: 'Transfer to Operator',
				value: 'transfer-to-operator',
			},
			{
				name: 'Transfer to Phone',
				value: 'transfer-to-phone',
			},
		],
		default: 'make-reservation',
		required: true,
		description: 'The name of the tool',
	},
	// ----------------------------------
	// Make Reservation Fields
	// ----------------------------------
	{
		displayName: 'Is Enabled',
		name: 'is_enabled',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['agentTool'],
				operation: ['update'],
				toolName: ['make-reservation', 'transfer-to-operator', 'transfer-to-phone'],
			},
		},
		default: true,
		description: 'Whether the tool is enabled for this agent',
	},
	{
		displayName: 'Send SMS',
		name: 'send_sms',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['agentTool'],
				operation: ['update'],
				toolName: ['make-reservation'],
			},
		},
		default: true,
		description: 'Whether to send SMS confirmation when reservation is made',
	},
	{
		displayName: 'Allow Overlapping Reservations',
		name: 'allow_overlapping_reservations',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['agentTool'],
				operation: ['update'],
				toolName: ['make-reservation'],
			},
		},
		default: false,
		description: 'Whether to allow overlapping reservations',
	},
	{
		displayName: 'Include Guests',
		name: 'include_guests',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['agentTool'],
				operation: ['update'],
				toolName: ['make-reservation'],
			},
		},
		default: false,
		description: 'Whether to request number of guests in the reservation',
	},
	{
		displayName: 'SMS Text',
		name: 'sms_text',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		displayOptions: {
			show: {
				resource: ['agentTool'],
				operation: ['update'],
				toolName: ['make-reservation'],
			},
		},
		default: '',
		placeholder: 'e.g. Gentile {nome_cliente}, la sua prenotazione è stata confermata...',
		description: 'SMS template (must include {nome_cliente}, {data_inizio}, {data_fine}, {link})',
	},
	{
		displayName: 'Reservation Duration (Minutes)',
		name: 'reservation_duration_minutes',
		type: 'number',
		typeOptions: {
			minValue: 15,
			maxValue: 480,
		},
		displayOptions: {
			show: {
				resource: ['agentTool'],
				operation: ['update'],
				toolName: ['make-reservation'],
			},
		},
		default: 60,
		description: 'Default reservation duration in minutes (15-480)',
	},
	{
		displayName: 'Reservation Hours',
		name: 'reservation_hours_ui',
		placeholder: 'Add Day Schedule',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['agentTool'],
				operation: ['update'],
				toolName: ['make-reservation'],
			},
		},
		default: {},
		options: [
			{
				name: 'scheduleValues',
				displayName: 'Schedule',
				values: [
					{
						displayName: 'Day',
						name: 'day',
						type: 'options',
						options: [
							{ name: 'Friday', value: 'friday' },
							{ name: 'Monday', value: 'monday' },
							{ name: 'Saturday', value: 'saturday' },
							{ name: 'Sunday', value: 'sunday' },
							{ name: 'Thursday', value: 'thursday' },
							{ name: 'Tuesday', value: 'tuesday' },
							{ name: 'Wednesday', value: 'wednesday' },
						],
						default: 'monday',
					},
					{
						displayName: 'Time Ranges',
						name: 'ranges',
						type: 'string',
						default: '09:00 - 18:00',
						placeholder: 'e.g. 09:00 - 12:00, 14:00 - 18:00',
					},
				],
			},
		],
		description: 'Working hours for accepting reservations',
	},
	{
		displayName: 'Default Check-In Time',
		name: 'default_checkin_time',
		type: 'string',
		placeholder: 'HH:MM',
		displayOptions: {
			show: {
				resource: ['agentTool'],
				operation: ['update'],
				toolName: ['make-reservation'],
			},
		},
		default: '',
		description: 'Default check-in time in HH:MM format (hotel only)',
	},
	{
		displayName: 'Default Check-Out Time',
		name: 'default_checkout_time',
		type: 'string',
		placeholder: 'HH:MM',
		displayOptions: {
			show: {
				resource: ['agentTool'],
				operation: ['update'],
				toolName: ['make-reservation'],
			},
		},
		default: '',
		description: 'Default check-out time in HH:MM format (hotel only)',
	},
	// ----------------------------------
	// Transfer to Operator Fields
	// ----------------------------------
	{
		displayName: 'Available Hours',
		name: 'available_hours_ui',
		placeholder: 'Add Day Schedule',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['agentTool'],
				operation: ['update'],
				toolName: ['transfer-to-operator'],
			},
		},
		default: {},
		options: [
			{
				name: 'scheduleValues',
				displayName: 'Schedule',
				values: [
					{
						displayName: 'Day',
						name: 'day',
						type: 'options',
						options: [
							{ name: 'Friday', value: 'friday' },
							{ name: 'Monday', value: 'monday' },
							{ name: 'Saturday', value: 'saturday' },
							{ name: 'Sunday', value: 'sunday' },
							{ name: 'Thursday', value: 'thursday' },
							{ name: 'Tuesday', value: 'tuesday' },
							{ name: 'Wednesday', value: 'wednesday' },
						],
						default: 'monday',
					},
					{
						displayName: 'Time Ranges',
						name: 'ranges',
						type: 'string',
						default: '09:00 - 18:00',
						placeholder: 'e.g. 09:00 - 12:00, 14:00 - 18:00',
					},
				],
			},
		],
		description: 'Operator availability hours',
	},
	{
		displayName: 'Enabled Departments',
		name: 'enabled_departments',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['agentTool'],
				operation: ['update'],
				toolName: ['transfer-to-operator'],
			},
		},
		default: '[]',
		description: 'List of enabled department UUIDs (empty list = all departments available)',
	},
	// ----------------------------------
	// Transfer to Phone Fields
	// ----------------------------------
	{
		displayName: 'Phone Destinations',
		name: 'phone_destinations_ui',
		placeholder: 'Add Destination',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['agentTool'],
				operation: ['update'],
				toolName: ['transfer-to-phone'],
			},
		},
		default: {},
		options: [
			{
				name: 'destinationValues',
				displayName: 'Destination',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						required: true,
					},
					{
						displayName: 'Phone Number',
						name: 'phone_number',
						type: 'string',
						default: '',
						placeholder: '+393471234567',
						required: true,
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Available Hours',
						name: 'available_hours_ui',
						placeholder: 'Add Day Schedule',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						options: [
							{
								name: 'scheduleValues',
								displayName: 'Schedule',
								values: [
									{
										displayName: 'Day',
										name: 'day',
										type: 'options',
										options: [
											{ name: 'Friday', value: 'friday' },
											{ name: 'Monday', value: 'monday' },
											{ name: 'Saturday', value: 'saturday' },
											{ name: 'Sunday', value: 'sunday' },
											{ name: 'Thursday', value: 'thursday' },
											{ name: 'Tuesday', value: 'tuesday' },
											{ name: 'Wednesday', value: 'wednesday' },
										],
										default: 'monday',
									},
									{
										displayName: 'Time Ranges',
										name: 'ranges',
										type: 'string',
										default: '09:00 - 18:00',
										placeholder: 'e.g. 09:00 - 12:00, 14:00 - 18:00',
									},
								],
							},
						],
						description: 'Operator availability hours',
					},
				],
			},
		],
		description: 'List of phone destinations',
	},
	{
		displayName: 'Transfer Message',
		name: 'transfer_message',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['agentTool'],
				operation: ['update'],
				toolName: ['transfer-to-phone'],
			},
		},
		default: '',
		description: 'Message said before transferring the call',
	},
];

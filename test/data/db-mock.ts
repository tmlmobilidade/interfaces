import { CreateAgencyDto, CreateAlertDto, CreateMunicipalityDto, createOperationalDate, CreateOrganizationDto, CreateRoleDto, CreateStopDto, CreateUserDto, CreateZoneDto, Email, Permission, Stop, User } from '@/types';

export const mockPermissions: Permission<unknown>[] = [
	// Write
	{ action: 'write', scope: 'stop' } as Permission<Stop>,
	{ action: 'write', scope: 'user' } as Permission<User>,
	// Read
	{ action: 'read', scope: 'user' } as Permission<User>,
	{ action: 'read', scope: 'stop' } as Permission<Stop>,
	// With resource
	{ action: 'read', resource: { code: ['111'] }, scope: 'stop' } as Permission<Stop>,
	{ action: 'read', resource: { code: ['222'] }, scope: 'stop' } as Permission<Stop>,
	{ action: 'write', resource: { code: ['111'] }, scope: 'stop' } as Permission<Stop>,

];

export const mockRoles: CreateRoleDto[] = [
	{ name: 'writer', permissions: mockPermissions.slice(0, 1) },
	{ name: 'reader', permissions: mockPermissions.slice(3, 4) },
];

export const mockUsers: CreateUserDto[] = [
	{
		email: 'writer@example.com' as Email,
		first_name: 'Writer',
		last_name: 'User',
		organization_ids: [
			'1',
			'2',
		],
		password_hash: 'hashedPassword',
		permissions: [],
		phone: '1234567890',
		role_ids: [
			'writer',
		],
		session_ids: [],
		verification_token_ids: [],
	},
	{
		avatar: '',
		bio: '',
		email: 'reader@example.com' as Email,
		first_name: 'Reader',
		last_name: 'User',
		organization_ids: [],
		password_hash: 'hashedPassword',
		permissions: [
			mockPermissions[4],
		],
		phone: '0987654321',
		role_ids: [
			'reader',
		],
		session_ids: [],
		verification_token_ids: [],
	},
	{
		avatar: '',
		bio: '',
		email: 'permission@example.com' as Email,
		first_name: 'Permission',
		last_name: 'User',
		organization_ids: [],
		password_hash: 'hashedPassword',
		permissions: [
			mockPermissions[1],
		],
		phone: '1234567890',
		role_ids: [],
		session_ids: [],
		verification_token_ids: [],
	},

];

export const mockZones: CreateZoneDto[] = [
	{
		border_color: '#cf7508',
		border_opacity: 0.5,
		border_width: 3,
		code: '1507',
		fill_color: '#cf7508',
		fill_opacity: 0.2,
		geojson: {
			geometry: {
				coordinates: [
					[
						[
							[
								-8.965806944622736,
								38.72688987365539,
							],
							[
								-8.96621857862725,
								38.72767872130188,
							],
						],
					],
					[
						[
							[
								-8.68484270610704,
								38.82667216470655,
							],
							[
								-8.68502407329156,
								38.82668395423508,
							],
						],
					],
				],
				type: 'MultiPolygon',
			},
			properties: {},
			type: 'Feature',
		},
		is_locked: false,
		name: 'Montijo',
	},
	{
		border_color: '#1ef916',
		border_opacity: 0.5,
		border_width: 3,
		code: '1502',
		fill_color: '#1fff17',
		fill_opacity: 0.2,
		geojson: {
			geometry: {
				coordinates: [
					[
						[
							[
								-8.965806944622736,
								38.72688987365539,
							],
							[
								-8.96621857862725,
								38.72767872130188,
							],
						],
					],
					[
						[
							[
								-8.68484270610704,
								38.82667216470655,
							],
							[
								-8.68502407329156,
								38.82668395423508,
							],
						],
					],
				],
				type: 'MultiPolygon',
			},
			properties: {},
			type: 'Feature',
		},
		is_locked: false,
		name: 'Montijo',
	},
];

export const mockStops: CreateStopDto[] = [
	{
		code: '010015',
		latitude: 38.7487576,
		locality: 'Alcochete',
		longitude: -8.9671055,
		municipality: '649b4cce0ac399a0115319e3',
		municipality_code: '1115',
		name: 'ALCOCHETE (R LIBERDADE) ESCOLA VALBOM',
		operational_status: 'ACTIVE',
		short_name: 'Escola Básica n.º 2 de Alcochete (Valbom)',
		tts_name: 'Alcochete ( Rua Liberdade ) Escola Valbom',
		zones: [],
	},
	{
		code: '010001',
		latitude: 38.7542436,
		locality: 'Alcochete',
		longitude: -8.9595566,
		municipality: '6450539f8f71c3c98f1fbed0',
		municipality_code: '1504',
		name: 'Rua Carlos Manuel Rodrigues Francisco (Escola)',
		operational_status: 'ACTIVE',
		short_name: 'R. Carlos Manuel Rodrigues Francisco (Escola)',
		tts_name: 'Rua Carlos Manuel Rodrigues Francisco ( Escola )',
		zones: [],
	},
];

export const mockOrganizations: CreateOrganizationDto[] = [
	{
		code: '1',
		name: 'Organization 1',
	},
	{
		code: '2',
		name: 'Organization 2',
	},
];

export const mockMunicipalities: CreateMunicipalityDto[] = [
	{
		border_color: '#ffffff',
		border_opacity: 0.5,
		border_width: 3,
		code: '1115',
		district: '11',
		fill_color: '#611919',
		fill_opacity: 0.5,
		geojson: {
			geometry: {
				coordinates: [
					[
						[
							-9.23542624099997,
							38.79627920200005,
						],
						[
							-9.235565959999974,
							38.79641254500007,
						],

					],
				],
				type: 'Polygon',
			},
			properties: {},
			type: 'Feature',
		},
		is_locked: false,
		name: 'Amadora',
		prefix: '03',
		region: 'PT170',
	},
	{
		border_color: '#ffffff',
		border_opacity: 0.5,
		border_width: 3,
		code: '1504',
		district: '15',
		fill_color: '#ad6666',
		fill_opacity: 0.5,
		geojson: {
			geometry: {
				coordinates: [
					[
						[
							-9.036244457999942,
							38.68370353600005,
						],
						[
							-9.03532428099993,
							38.68390666000005,
						],
					],
				],
				type: 'Polygon',
			},
			properties: {},
			type: 'Feature',
		},
		is_locked: false,
		name: 'Barreiro',
		prefix: '04',
		region: 'PT170',
	},
];

export const mockAgencies: CreateAgencyDto[] = [
	{
		code: '1',
		email: 'agency1@example.com',
		fare_url: '',
		is_locked: false,
		lang: 'pt',
		name: 'Agency 1',
		operation_start_date: createOperationalDate('20240101'),
		phone: '1234567890',
		price_per_km: 0,
		timezone: 'Europe/Lisbon',
		total_vkm_per_year: 0,
		url: 'https://agency1.example.com',
	},
	{
		code: '2',
		email: 'agency2@example.com',
		fare_url: '',
		is_locked: false,
		lang: 'pt',
		name: 'Agency 2',
		operation_start_date: createOperationalDate('20240101'),
		phone: '1234567890',
		price_per_km: 0,
		timezone: 'Europe/Lisbon',
		total_vkm_per_year: 0,
		url: 'https://agency2.example.com',
	},
];

export const mockAlerts: CreateAlertDto[] = [
	{
		active_period_end_date: createOperationalDate('20240201'),
		active_period_start_date: createOperationalDate('20240101'),
		agency_ids: [
			'67378cebad93f9b2668ec93c',
		],
		cause: 'ACCIDENT',
		description: '',
		effect: 'SIGNIFICANT_DELAYS',
		image_url: '',
		line_ids: [],
		municipality_ids: [
			'649b4cce0ac399a0115319e3',
		],
		publish_end_date: createOperationalDate('20240201'),
		publish_start_date: createOperationalDate('20240101'),
		publish_status: 'PUBLISHED',
		route_ids: [],
		stop_ids: [
			'6476b095424adb51586dffa7',
		],
		title: '',
	},
	{
		active_period_end_date: createOperationalDate('20240301'),
		active_period_start_date: createOperationalDate('20240201'),
		agency_ids: [
			'67378cf97355b5132e6845c9',
		],
		cause: 'ACCIDENT',
		description: '',
		effect: 'SIGNIFICANT_DELAYS',
		image_url: '',
		line_ids: [],
		municipality_ids: [
			'6450539f8f71c3c98f1fbed0',
		],
		publish_end_date: createOperationalDate('20240301'),
		publish_start_date: createOperationalDate('20240201'),
		publish_status: 'PUBLISHED',
		route_ids: [],
		stop_ids: [
			'6476b094424adb51586dfcee',
		],
		title: '',
	},
	{
		active_period_end_date: createOperationalDate('20240501'),
		active_period_start_date: createOperationalDate('20240401'),
		agency_ids: [
			'67378cebad93f9b2668ec93c',
			'67378cf97355b5132e6845c9',
		],
		cause: 'CONSTRUCTION',
		description: '',
		effect: 'DETOUR',
		image_url: '',
		line_ids: [],
		municipality_ids: [
			'649b4cce0ac399a0115319e3',
			'6450539f8f71c3c98f1fbed0',
		],
		publish_end_date: createOperationalDate('20240501'),
		publish_start_date: createOperationalDate('20240401'),
		publish_status: 'PUBLISHED',
		route_ids: [],
		stop_ids: [
			'6476b095424adb51586dffa7',
			'6476b094424adb51586dfcee',
		],
		title: '',
	},
];

import { MongoConnector } from '@/connectors/mongo.connector';
import { Db } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { mockAgencies, mockAlerts, mockMunicipalities, mockOrganizations, mockPermissions, mockRoles, mockStops, mockUsers, mockZones } from './data/db-mock';

let mongoServer: MongoMemoryServer;
let db: Db;
let mongoConnector: MongoConnector;

beforeAll(async () => {
	// Start In-Memory MongoDB Server
	mongoServer = await MongoMemoryServer.create();
	const uri = mongoServer.getUri();

	// Override environment variable for MongoDB URI
	process.env.TML_INTERFACES_AUTH = uri;
	process.env.TML_INTERFACES_STOPS = uri;
	process.env.TML_INTERFACES_MUNICIPALITIES = uri;
	process.env.TML_INTERFACES_ORGANIZATIONS = uri;
	process.env.TML_INTERFACES_AGENCIES = uri;
	process.env.TML_INTERFACES_ZONES = uri;
	process.env.TML_INTERFACES_RIDES = uri;
	process.env.TML_INTERFACES_ALERTS = uri;
	// Initialize MongoConnector
	mongoConnector = new MongoConnector(uri);
	await mongoConnector.connect();
	db = mongoConnector.db('production');

	// Seed Collections with Mock Data
	await seedDatabase(db);
});

afterAll(async () => {
	// Close MongoDB connection and stop server
	if (mongoConnector) {
		await mongoConnector.disconnect();
	}
	if (mongoServer) {
		await mongoServer.stop();
	}
});

/**
    * Seeds the database with mock data.
    * @param db - The MongoDB database instance.
    */
export async function seedDatabase(db: Db) {
	const collections = [
		{ data: mockPermissions, name: 'permissions' },
		{ data: mockRoles, name: 'roles' },
		{ data: mockUsers, name: 'users' },
		{ data: mockZones, name: 'zones' },
		{ data: mockStops, name: 'stops' },
		{ data: mockOrganizations, name: 'organizations' },
		{ data: mockMunicipalities, name: 'municipalities' },
		{ data: mockAgencies, name: 'agencies' },
		{ data: mockAlerts, name: 'alerts' },
	];

	for (const collection of collections) {
		await db.collection(collection.name).insertMany(collection.data);
	}
}

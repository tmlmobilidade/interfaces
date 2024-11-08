import { Collection, Db } from 'mongodb';

export async function createAgencyIndexes(collection: Collection<unknown>) {
	return await collection.createIndexes([
		{ background: true, key: { name: 1 }, unique: true },
		{ background: true, key: { code: 1 }, unique: true },
		{ background: true, key: { email: 1 }, unique: true },
	]);
}

export async function createHashedShapeIndexes(collection: Collection<unknown>) {
	return await collection.createIndexes([
		{ background: true, key: { code: 1 }, unique: true },
		{ background: true, key: { agency_id: 1 } },
	]);
}

export async function createHashedTripIndexes(collection: Collection<unknown>) {
	return await collection.createIndexes([
		{ background: true, key: { code: 1 }, unique: true },
		{ background: true, key: { agency_id: 1 } },
		{ background: true, key: { line_id: 1 } },
	]);
}

export async function createMunicipalityIndexes(collection: Collection<unknown>) {
	return await collection.createIndexes([
		{ background: true, key: { code: 1 }, unique: true },
		{ background: true, key: { name: 1 } },
		{ background: true, key: { prefix: 1 } },
	]);
}

export async function createOrganizationIndexes(collection: Collection<unknown>) {
	return await collection.createIndexes([
		{ background: true, key: { name: 1 }, unique: true },
	]);
}

export async function createRideIndexes(collection: Collection<unknown>) {
	return await collection.createIndexes([
		{ background: true, key: { agency_id: 1 } },
		{ background: true, key: { code: 1 }, unique: true },
		{ background: true, key: { line_id: 1 } },
		{ background: true, key: { operational_day: -1 } },
	]);
}

export async function createRoleIndexes(collection: Collection<unknown>) {
	return await collection.createIndexes([
		{ background: true, key: { name: 1 }, unique: true },
	]);
}

export async function createSessionIndexes(collection: Collection<unknown>) {
	return await collection.createIndexes([
		{ background: true, key: { user_id: 1 } },
		{ background: true, key: { expires: 1 } },
		{ background: true, key: { token: 1 }, unique: true },
	]);
}

export async function createStopIndexes(collection: Collection<unknown>) {
	return await collection.createIndexes([
		{ background: true, key: { code: 1 }, unique: true },
		{ background: true, key: { agency_id: 1 } },
		{ background: true, key: { municipality_id: 1 } },
		{ background: true, key: { name: 1 } },
	]);
}

export async function createUserIndexes(collection: Collection<unknown>) {
	return await collection.createIndexes([
		{ background: true, key: { email: 1 }, unique: true },
		{ background: true, key: { phone: 1 }, unique: true },
		{ background: true, key: { 'profile.first_name': 1, 'profile.last_name': 1 } },
		{ background: true, key: { session_ids: 1 } },
		{ background: true, key: { role_ids: 1 } },
	]);
}

export async function createVerificationTokenIndexes(collection: Collection<unknown>) {
	return await collection.createIndexes([
		{ background: true, key: { expires: 1 } },
		{ background: true, key: { token: 1 }, unique: true },
	]);
}

export async function createZoneIndexes(collection: Collection<unknown>) {
	return await collection.createIndexes([
		{ background: true, key: { code: 1 }, unique: true },
		{ background: true, key: { name: 1 } },
	]);
}

export async function createIndexFactory(database: Db, collectionName: string) {
	const collection = database.collection(collectionName);
	switch (collectionName) {
		case 'agencies':
			return await createAgencyIndexes(collection);
		case 'hashed_shapes':
			return await createHashedShapeIndexes(collection);
		case 'hashed_trips':
			return await createHashedTripIndexes(collection);
		case 'municipalities':
			return await createMunicipalityIndexes(collection);
		case 'organizations':
			return await createOrganizationIndexes(collection);
		case 'rides':
			return await createRideIndexes(collection);
		case 'roles':
			return await createRoleIndexes(collection);
		case 'sessions':
			return await createSessionIndexes(collection);
		case 'stops':
			return await createStopIndexes(collection);
		case 'users':
			return await createUserIndexes(collection);
		case 'verification_tokens':
			return await createVerificationTokenIndexes(collection);
		case 'zones':
			return await createZoneIndexes(collection);
		default:
			return null;
	}
}

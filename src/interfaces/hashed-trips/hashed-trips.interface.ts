/* * */

import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { CreateHashedTripDto, HashedTrip, UpdateHashedTripDto } from '@/interfaces/hashed-trips/hashed-trip.type';
import { AsyncSingletonProxy } from '@/lib/utils';

/* * */

class HashedTripsClass extends MongoCollectionClass<HashedTrip, CreateHashedTripDto, UpdateHashedTripDto> {
	private static _instance: HashedTripsClass;

	private constructor() {
		super();
	}

	public static async getInstance() {
		if (!HashedTripsClass._instance) {
			const instance = new HashedTripsClass();
			await instance.connect();
			HashedTripsClass._instance = instance;
		}
		return HashedTripsClass._instance;
	}

	protected getCollectionName() {
		return 'hashed_trips';
	}

	protected getEnvName() {
		return 'TML_INTERFACES_HASHED_TRIPS';
	}
}

/* * */

export const hashedTrips = AsyncSingletonProxy(HashedTripsClass);

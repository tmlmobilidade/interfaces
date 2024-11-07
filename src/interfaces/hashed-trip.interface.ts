import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { HashedTrip } from '@/types/ride';
import { Filter } from 'mongodb';

class HashedTripsClass extends MongoCollectionClass<HashedTrip> {
	private static _instance: HashedTripsClass;

	private constructor() {
		super();
	}

	public static getInstance() {
		if (!HashedTripsClass._instance) {
			HashedTripsClass._instance = new HashedTripsClass();
		}
		return HashedTripsClass._instance;
	}

	protected getCollectionName() {
		return 'hashed_trips';
	}

	protected getDbUri() {
		return process.env.TML_INTERFACES_RIDES;
	}

	/**
	 * Finds a ride document by its code.
	 *
	 * @param code - The code of the ride to find
	 * @returns A promise that resolves to the matching ride document or null if not found
	 */
	async findByCode(code: string) {
		return this.mongoCollection.findOne({ code } as Filter<HashedTrip>);
	}

	/**
	 * Updates a stop document by its code.
	 *
	 * @param code - The code of the stop to update.
	 * @param updateFields - The fields to update in the stop document.
	 * @returns A promise that resolves to the result of the update operation.
	 */
	async updateByCode(code: string, updateFields: Partial<HashedTrip>) {
		return this.mongoCollection.updateOne({ code } as Filter<HashedTrip>, { $set: updateFields });
	}
}

export const hashedTrips = HashedTripsClass.getInstance();

import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { Ride } from '@/types/ride';
import { Filter } from 'mongodb';

class RidesClass extends MongoCollectionClass<Ride> {
	private static _instance: RidesClass;

	private constructor() {
		super();
	}

	public static getInstance() {
		if (!RidesClass._instance) {
			RidesClass._instance = new RidesClass();
		}
		return RidesClass._instance;
	}

	protected getCollectionName() {
		return 'rides';
	}

	protected getDbUri() {
		return process.env.TML_INTERFACES_RIDES;
	}

	/**
	 * Finds ride documents by agency ID.
	 *
	 * @param id - The agency ID to search for
	 * @returns A promise that resolves to an array of matching ride documents
	 */
	async findByAgencyId(id: string) {
		return this.mongoCollection.find({ agency_id: id } as Filter<Ride>).toArray();
	}

	/**
	 * Finds a ride document by its code.
	 *
	 * @param code - The code of the ride to find
	 * @returns A promise that resolves to the matching ride document or null if not found
	 */
	async findByCode(code: string) {
		return this.mongoCollection.findOne({ code } as Filter<Ride>);
	}

	/**
	 * Updates a stop document by its code.
	 *
	 * @param code - The code of the stop to update.
	 * @param updateFields - The fields to update in the stop document.
	 * @returns A promise that resolves to the result of the update operation.
	 */
	async updateByCode(code: string, updateFields: Partial<Ride>) {
		return this.mongoCollection.updateOne({ code } as Filter<Ride>, { $set: updateFields });
	}
}

export const rides = RidesClass.getInstance();

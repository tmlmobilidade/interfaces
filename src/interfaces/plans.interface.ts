/* * */

import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { AsyncSingletonProxy } from '@/lib/utils';
import { Plan } from '@/types/plan';
import { Filter } from 'mongodb';

/* * */

class PlansClass extends MongoCollectionClass<Plan> {
	private static _instance: PlansClass;

	private constructor() {
		super();
	}

	public static async getInstance() {
		if (!PlansClass._instance) {
			const instance = new PlansClass();
			await instance.connect();
			PlansClass._instance = instance;
		}
		return PlansClass._instance;
	}

	protected getCollectionName() {
		return 'plans';
	}

	protected getDbUri() {
		return process.env.TML_INTERFACES_PLANS ?? '';
	}

	/**
	 * Finds apexLocation documents by agency ID.
	 *
	 * @param id - The agency ID to search for
	 * @returns A promise that resolves to an array of matching apexLocation documents
	 */
	async findByAgencyId(id: string) {
		return this.mongoCollection.find({ agency_id: id } as Filter<Plan>).toArray();
	}

	/**
	 * Finds a apexLocation document by its code.
	 *
	 * @param code - The code of the apexLocation to find
	 * @returns A promise that resolves to the matching apexLocation document or null if not found
	 */
	async findByCode(code: string) {
		return this.mongoCollection.findOne({ code } as Filter<Plan>);
	}

	/**
	 * Updates a stop document by its code.
	 *
	 * @param code - The code of the stop to update.
	 * @param updateFields - The fields to update in the stop document.
	 * @returns A promise that resolves to the result of the update operation.
	 */
	async updateByCode(code: string, updateFields: Partial<Plan>) {
		return this.mongoCollection.updateOne({ code } as Filter<Plan>, { $set: updateFields });
	}
}

/* * */

export const plans = AsyncSingletonProxy(PlansClass);

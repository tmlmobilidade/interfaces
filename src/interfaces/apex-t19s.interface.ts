/* * */

import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { AsyncSingletonProxy } from '@/lib/utils';
import { ApexT19 } from '@/types/apex-t19';
import { Filter } from 'mongodb';

/* * */

class ApexT19sClass extends MongoCollectionClass<ApexT19> {
	private static _instance: ApexT19sClass;

	private constructor() {
		super();
	}

	public static async getInstance() {
		if (!ApexT19sClass._instance) {
			const instance = new ApexT19sClass();
			await instance.connect();
			ApexT19sClass._instance = instance;
		}
		return ApexT19sClass._instance;
	}

	protected getCollectionName() {
		return 'apexLocations';
	}

	protected getDbUri() {
		return process.env.TML_INTERFACES_RIDES ?? '';
	}

	/**
	 * Finds apexLocation documents by agency ID.
	 *
	 * @param id - The agency ID to search for
	 * @returns A promise that resolves to an array of matching apexLocation documents
	 */
	async findByAgencyId(id: string) {
		return this.mongoCollection.find({ agency_id: id } as Filter<ApexT19>).toArray();
	}

	/**
	 * Finds a apexLocation document by its code.
	 *
	 * @param code - The code of the apexLocation to find
	 * @returns A promise that resolves to the matching apexLocation document or null if not found
	 */
	async findByCode(code: string) {
		return this.mongoCollection.findOne({ code } as Filter<ApexT19>);
	}

	/**
	 * Updates a stop document by its code.
	 *
	 * @param code - The code of the stop to update.
	 * @param updateFields - The fields to update in the stop document.
	 * @returns A promise that resolves to the result of the update operation.
	 */
	async updateByCode(code: string, updateFields: Partial<ApexT19>) {
		return this.mongoCollection.updateOne({ code } as Filter<ApexT19>, { $set: updateFields });
	}
}

/* * */

export const apexT19s = AsyncSingletonProxy(ApexT19sClass);

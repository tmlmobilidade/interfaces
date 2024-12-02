/* * */

import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { ApexT19, CreateApexT19Dto, UpdateApexT19Dto } from '@/interfaces/apex-t19/apex-t19.type';
import { AsyncSingletonProxy } from '@/lib/utils';
import { Filter, IndexDescription } from 'mongodb';

/* * */

class ApexT19sClass extends MongoCollectionClass<ApexT19, CreateApexT19Dto, UpdateApexT19Dto> {
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

	protected getCollectionIndexes(): IndexDescription[] {
		return [];
	}

	protected getCollectionName(): string {
		return 'apex_t19s';
	}

	protected getEnvName(): string {
		return 'TML_INTERFACES_APEX_T19';
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

export const apexT19 = AsyncSingletonProxy(ApexT19sClass);

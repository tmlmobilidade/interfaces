/* * */

import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { ApexT11, CreateApexT11Dto, UpdateApexT11Dto } from '@/interfaces/apex-t11/apex-t11.type';
import { AsyncSingletonProxy } from '@/lib/utils';
import { Filter, IndexDescription } from 'mongodb';

/* * */

class ApexT11sClass extends MongoCollectionClass<ApexT11, CreateApexT11Dto, UpdateApexT11Dto> {
	private static _instance: ApexT11sClass;

	private constructor() {
		super();
	}

	public static async getInstance() {
		if (!ApexT11sClass._instance) {
			const instance = new ApexT11sClass();
			await instance.connect();
			ApexT11sClass._instance = instance;
		}
		return ApexT11sClass._instance;
	}

	protected getCollectionIndexes(): IndexDescription[] {
		return [];
	}

	protected getCollectionName(): string {
		return 'apex_t11s';
	}

	protected getEnvName(): string {
		return 'TML_INTERFACE_APEX_T11';
	}

	/**
	 * Finds apexT11 documents by agency ID.
	 *
	 * @param id - The agency ID to search for
	 * @returns A promise that resolves to an array of matching apexT11 documents
	 */
	async findByAgencyId(id: string) {
		return this.mongoCollection.find({ agency_id: id } as Filter<ApexT11>).toArray();
	}

	/**
	 * Finds a apexT11 document by its code.
	 *
	 * @param code - The code of the apexT11 to find
	 * @returns A promise that resolves to the matching apexT11 document or null if not found
	 */
	async findByCode(code: string) {
		return this.mongoCollection.findOne({ code } as Filter<ApexT11>);
	}

	/**
	 * Updates a stop document by its code.
	 *
	 * @param code - The code of the stop to update.
	 * @param updateFields - The fields to update in the stop document.
	 * @returns A promise that resolves to the result of the update operation.
	 */
	async updateByCode(code: string, updateFields: Partial<ApexT11>) {
		return this.mongoCollection.updateOne({ code } as Filter<ApexT11>, { $set: updateFields });
	}
}

/* * */

export const apexT11 = AsyncSingletonProxy(ApexT11sClass);

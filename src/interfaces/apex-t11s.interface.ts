/* * */

import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { AsyncSingletonProxy } from '@/lib/utils';
import { ApexT11 } from '@/types/apex-t11';
import { Filter } from 'mongodb';

/* * */

class ApexT11sClass extends MongoCollectionClass<ApexT11> {
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

	protected getCollectionName() {
		return 'apex_t11s';
	}

	protected getDbUri() {
		return process.env.TML_INTERFACES_APEX_T11S ?? '';
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

export const apexT11s = AsyncSingletonProxy(ApexT11sClass);

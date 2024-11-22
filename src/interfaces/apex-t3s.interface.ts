/* * */

import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { AsyncSingletonProxy } from '@/lib/utils';
import { ApexT3 } from '@/types/apex-t3';
import { Filter } from 'mongodb';

/* * */

class ApexT3Class extends MongoCollectionClass<ApexT3> {
	private static _instance: ApexT3Class;

	private constructor() {
		super();
	}

	public static async getInstance() {
		if (!ApexT3Class._instance) {
			const instance = new ApexT3Class();
			await instance.connect();
			ApexT3Class._instance = instance;
		}
		return ApexT3Class._instance;
	}

	protected getCollectionName() {
		return 'apex-3';
	}

	protected getDbUri() {
		return process.env.TML_INTERFACES_RIDES ?? '';
	}

	/**
	 * Finds apexT3 documents by agency ID.
	 *
	 * @param id - The agency ID to search for
	 * @returns A promise that resolves to an array of matching apexT3 documents
	 */
	async findByAgencyId(id: string) {
		return this.mongoCollection.find({ agency_id: id } as Filter<ApexT3>).toArray();
	}

	/**
	 * Finds a apexT3 document by its code.
	 *
	 * @param code - The code of the apexT3 to find
	 * @returns A promise that resolves to the matching apexT3 document or null if not found
	 */
	async findByCode(code: string) {
		return this.mongoCollection.findOne({ code } as Filter<ApexT3>);
	}

	/**
	 * Updates a stop document by its code.
	 *
	 * @param code - The code of the stop to update.
	 * @param updateFields - The fields to update in the stop document.
	 * @returns A promise that resolves to the result of the update operation.
	 */
	async updateByCode(code: string, updateFields: Partial<ApexT3>) {
		return this.mongoCollection.updateOne({ code } as Filter<ApexT3>, { $set: updateFields });
	}
}

/* * */

export const apexT3 = AsyncSingletonProxy(ApexT3Class);

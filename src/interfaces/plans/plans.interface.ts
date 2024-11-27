/* * */

import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { CreatePlanDto, Plan, UpdatePlanDto } from '@/interfaces/plans/plan.type';
import { AsyncSingletonProxy } from '@/lib/utils';
import { Filter } from 'mongodb';

/* * */

class PlansClass extends MongoCollectionClass<Plan, CreatePlanDto, UpdatePlanDto> {
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

	protected getEnvName() {
		return 'TML_INTERFACES_PLANS';
	}

	/**
	 * Finds Plan documents by agency ID.
	 *
	 * @param id - The agency ID to search for
	 * @returns A promise that resolves to an array of matching documents
	 */
	async findByAgencyId(id: string) {
		return this.mongoCollection.find({ agency_id: id } as Filter<Plan>).toArray();
	}
}

/* * */

export const plans = AsyncSingletonProxy(PlansClass);

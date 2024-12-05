/* * */

import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { ApexT19 } from '@/interfaces/apex-t19/apex-t19.type';
import { AsyncSingletonProxy } from '@/lib/utils';
import { IndexDescription } from 'mongodb';

/* * */

class ApexT19Class extends MongoCollectionClass<ApexT19, ApexT19, ApexT19> {
	private static _instance: ApexT19Class;

	private constructor() {
		super();
	}

	public static async getInstance() {
		if (!ApexT19Class._instance) {
			const instance = new ApexT19Class();
			await instance.connect();
			ApexT19Class._instance = instance;
		}
		return ApexT19Class._instance;
	}

	protected getCollectionIndexes(): IndexDescription[] {
		return [
			{ background: true, key: { operational_date: -1 } },
			// eslint-disable-next-line perfectionist/sort-objects
			{ background: true, key: { operational_date: -1, agency_id: 1 } },
			{ background: true, key: { operational_date: -1, pattern_id: 1 } },
			{ background: true, key: { operational_date: -1, trip_id: 1 } },
			{ background: true, key: { operational_date: -1, vehicle_id: 1 } },
		];
	}

	protected getCollectionName(): string {
		return 'apex_t19';
	}

	protected getEnvName(): string {
		return 'TML_INTERFACE_APEX_T19';
	}
}

/* * */

export const apexT19 = AsyncSingletonProxy(ApexT19Class);

/* * */

import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { ApexT11 } from '@/interfaces/apex-t11/apex-t11.type';
import { AsyncSingletonProxy } from '@/lib/utils';
import { IndexDescription } from 'mongodb';

/* * */

class ApexT11Class extends MongoCollectionClass<ApexT11, ApexT11, ApexT11> {
	private static _instance: ApexT11Class;

	private constructor() {
		super();
	}

	public static async getInstance() {
		if (!ApexT11Class._instance) {
			const instance = new ApexT11Class();
			await instance.connect();
			ApexT11Class._instance = instance;
		}
		return ApexT11Class._instance;
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
		return 'apex_t11';
	}

	protected getEnvName(): string {
		return 'TML_INTERFACE_APEX_T11';
	}
}

/* * */

export const apexT11 = AsyncSingletonProxy(ApexT11Class);

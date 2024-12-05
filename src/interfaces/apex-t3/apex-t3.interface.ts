/* * */

import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { ApexT3 } from '@/interfaces/apex-t3/apex-t3.type';
import { AsyncSingletonProxy } from '@/lib/utils';
import { IndexDescription } from 'mongodb';

/* * */

class ApexT3Class extends MongoCollectionClass<ApexT3, ApexT3, ApexT3> {
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

	protected getCollectionIndexes(): IndexDescription[] {
		return [];
	}

	protected getCollectionName(): string {
		return 'apex_t3';
	}

	protected getEnvName(): string {
		return 'TML_INTERFACE_APEX_T3';
	}
}

/* * */

export const apexT3 = AsyncSingletonProxy(ApexT3Class);

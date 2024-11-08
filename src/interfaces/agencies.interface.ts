import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { AsyncSingletonProxy } from '@/lib/utils';
import { Agency } from '@/types';

class AgenciesClass extends MongoCollectionClass<Agency> {
	private static _instance: AgenciesClass;

	private constructor() {
		super();
	}

	public static async getInstance() {
		if (!AgenciesClass._instance) {
			const instance = new AgenciesClass();
			await instance.connect();
			AgenciesClass._instance = instance;
		}
		return AgenciesClass._instance;
	}

	protected getCollectionName(): string {
		return 'agencies';
	}

	protected getDbUri(): string {
		return process.env.TML_INTERFACES_AGENCIES;
	}
}

export const agencies = AsyncSingletonProxy(AgenciesClass);

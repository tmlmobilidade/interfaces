import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { Agency } from '@/types';

class AgenciesClass extends MongoCollectionClass<Agency> {
	private static _instance: AgenciesClass;

	private constructor() {
		super();
	}

	public static getInstance() {
		if (!AgenciesClass._instance) {
			AgenciesClass._instance = new AgenciesClass();
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

export const agencies = AgenciesClass.getInstance();

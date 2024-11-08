import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { AsyncSingletonProxy } from '@/lib/utils';
import { Session } from '@/types';

class SessionsClass extends MongoCollectionClass<Session> {
	private static _instance: SessionsClass;

	private constructor() {
		super();
	}

	public static async getInstance() {
		if (!SessionsClass._instance) {
			const instance = new SessionsClass();
			await instance.connect();
			SessionsClass._instance = instance;
		}
		return SessionsClass._instance;
	}

	protected getCollectionName(): string {
		return 'sessions';
	}

	protected getDbUri(): string {
		return process.env.TML_INTERFACES_AUTH;
	}
}

export const sessions = AsyncSingletonProxy(SessionsClass);

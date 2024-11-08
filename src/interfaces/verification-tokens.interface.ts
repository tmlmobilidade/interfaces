import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { AsyncSingletonProxy } from '@/lib/utils';
import { VerificationToken } from '@/types';

class VerificationTokensClass extends MongoCollectionClass<VerificationToken> {
	private static _instance: VerificationTokensClass;

	private constructor() {
		super();
	}

	public static async getInstance() {
		if (!VerificationTokensClass._instance) {
			const instance = new VerificationTokensClass();
			await instance.connect();
			VerificationTokensClass._instance = instance;
		}
		return VerificationTokensClass._instance;
	}

	protected getCollectionName(): string {
		return 'verification_tokens';
	}

	protected getDbUri(): string {
		return process.env.TML_INTERFACES_AUTH;
	}
}

export const verificationTokens = AsyncSingletonProxy(VerificationTokensClass);

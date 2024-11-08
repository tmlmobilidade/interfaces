import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { AsyncSingletonProxy } from '@/lib/utils';
import { Organization } from '@/types';
import { Filter } from 'mongodb';

class OrganizationsClass extends MongoCollectionClass<Organization> {
	private static _instance: OrganizationsClass;

	private constructor() {
		super();
	}

	public static async getInstance() {
		if (!OrganizationsClass._instance) {
			const instance = new OrganizationsClass();
			await instance.connect();
			OrganizationsClass._instance = instance;
		}
		return OrganizationsClass._instance;
	}

	protected getCollectionName() {
		return 'organizations';
	}

	protected getDbUri() {
		return process.env.TML_INTERFACES_ORGANIZATIONS;
	}

	/**
	 * Finds an organization by its code
	 *
	 * @param code - The code of the organization to find
	 * @returns A promise that resolves to the matching organization document or null if not found
	 */
	async findByCode(code: string) {
		return this.mongoCollection.findOne({ code } as Filter<Organization>);
	}
}

export const organizations = AsyncSingletonProxy(OrganizationsClass);

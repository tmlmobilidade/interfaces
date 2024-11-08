import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { User } from '@/types';
import { Filter } from 'mongodb';

class UsersClass extends MongoCollectionClass<User> {
	private static _instance: UsersClass;

	private constructor() {
		super();
		this.connect();
	}

	public static getInstance() {
		if (!UsersClass._instance) {
			UsersClass._instance = new UsersClass();
		}
		return UsersClass._instance;
	}

	protected getCollectionName(): string {
		return 'users';
	}

	protected getDbUri(): string {
		return process.env.TML_INTERFACES_AUTH;
	}

	/**
     * Finds a user document by its email.
     *
     * @param email - The email of the user to find
     * @returns A promise that resolves to the matching user document or null if not found
	 */
	async findByEmail(email: string) {
		return this.mongoCollection.findOne({ email } as Filter<User>);
	}

	/**
	 * Finds users by their organization code
	 *
	 * @param code - The code of the organization to find users for
	 * @returns A promise that resolves to the matching user documents or null if not found
	 */
	async findByOrganization(code: string) {
		return this.mongoCollection.find({ organization_code: code } as Filter<User>).toArray();
	}

	/**
	 * Finds a user by their role
	 *
	 * @param role - The role of the user to find
	 * @returns A promise that resolves to the matching user document or null if not found
	 */
	async findByRole(role: string) {
		return this.mongoCollection.find({ role_ids: { $in: [role] } } as Filter<User>).toArray();
	}
}

export const users = UsersClass.getInstance();

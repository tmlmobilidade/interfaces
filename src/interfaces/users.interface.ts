import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { AsyncSingletonProxy } from '@/lib/utils';
import { User } from '@/types';
import { Filter, ObjectId, Sort, WithId } from 'mongodb';

class UsersClass extends MongoCollectionClass<User> {
	private static _instance: UsersClass;

	private constructor() {
		super();
	}

	public static async getInstance() {
		if (!UsersClass._instance) {
			const instance = new UsersClass();
			await instance.connect();
			UsersClass._instance = instance;
		}
		return UsersClass._instance;
	}

	protected getCollectionName(): string {
		return 'users';
	}

	protected getDbUri(): string {
		return process.env.TML_INTERFACES_AUTH;
	}

	private deletePasswordHash(user: WithId<User>) {
		delete user.password_hash;
		return user;
	}

	/**
	 * Finds a user document by its email.
	 *
	 * @param email - The email of the user to find
	 * @param includePasswordHash - Whether to include the password hash in the result
	 * @returns A promise that resolves to the matching user document or null if not found
	 */
	async findByEmail(email: string, includePasswordHash = false) {
		const user = await this.mongoCollection.findOne({ email } as Filter<User>);
		if (!user) {
			return null;
		}

		return includePasswordHash ? user : this.deletePasswordHash(user);
	}

	/**
	 * Finds a document by its ID.
	 *
	 * @param id - The ID of the document to find
	 * @param includePasswordHash - Whether to include the password hash in the result
	 * @returns A promise that resolves to the matching document or null if not found
	 */
	async findById(id: ObjectId | string, includePasswordHash = false) {
		const user = await this.mongoCollection.findOne({ _id: id instanceof ObjectId ? id : new ObjectId(id) } as unknown as Filter<User>);
		if (!user) {
			return null;
		}

		return includePasswordHash ? user : this.deletePasswordHash(user);
	}

	/**
	 * Finds users by their organization code
	 *
	 * @param code - The code of the organization to find users for
	 * @param includePasswordHash - Whether to include the password hash in the result
	 * @returns A promise that resolves to the matching user documents or null if not found
	 */
	async findByOrganization(id: ObjectId | string, includePasswordHash = false) {
		const users = await this.mongoCollection.find({ organization_ids: { $in: [id instanceof ObjectId ? id : new ObjectId(id)] } } as unknown as Filter<User>).toArray();
		return includePasswordHash ? users : users.map(user => this.deletePasswordHash(user));
	}

	/**
	 * Finds a user by their role
	 *
	 * @param role - The role of the user to find
	 * @returns A promise that resolves to the matching user document or null if not found
	 */
	async findByRole(role: string, includePasswordHash = false) {
		const users = await this.mongoCollection.find({ role_ids: { $in: [new ObjectId(role)] } } as unknown as Filter<User>).toArray();
		return includePasswordHash ? users : users.map(user => this.deletePasswordHash(user));
	}

	/**
	 * Finds multiple documents matching the filter criteria with optional pagination and sorting.
	 *
	 * @param filter - (Optional) filter criteria to match documents
	 * @param perPage - (Optional) number of documents per page for pagination
	 * @param page - (Optional) page number for pagination
	 * @param sort - (Optional) sort specification
	 * @returns A promise that resolves to an array of matching documents
	 */
	async findMany(filter?: Filter<User>, perPage?: number, page?: number, sort?: Sort) {
		const query = this.mongoCollection.find(filter);
		if (perPage) query.limit(perPage);
		if (page && perPage) query.skip(perPage * (page - 1));
		if (sort) query.sort(sort);
		const users = await query.toArray();
		return users.map(user => this.deletePasswordHash(user));
	}

	async findOne(filter: Filter<User>) {
		const user = await this.mongoCollection.findOne(filter);
		if (!user) {
			return null;
		}

		return this.deletePasswordHash(user);
	}
}

export const users = AsyncSingletonProxy(UsersClass);

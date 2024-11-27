import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { AsyncSingletonProxy } from '@/lib/utils';
import { CreateRoleDto, Role, UpdateRoleDto } from '@/types';
import { Filter } from 'mongodb';

class RolesClass extends MongoCollectionClass<Role, CreateRoleDto, UpdateRoleDto> {
	private static _instance: RolesClass;

	private constructor() {
		super();
	}

	public static async getInstance() {
		if (!RolesClass._instance) {
			const instance = new RolesClass();
			await instance.connect();
			RolesClass._instance = instance;
		}
		return RolesClass._instance;
	}

	protected getCollectionName() {
		return 'roles';
	}

	protected getEnvName() {
		return 'TML_INTERFACES_AUTH';
	}

	/**
	 * Finds a role by its name
	 *
	 * @param name - The name of the role to find
	 * @returns A promise that resolves to the matching role document or null if not found
	 */
	async findByName(name: string) {
		return this.mongoCollection.findOne({ name } as Filter<Role>);
	}
}

export const roles = AsyncSingletonProxy(RolesClass);

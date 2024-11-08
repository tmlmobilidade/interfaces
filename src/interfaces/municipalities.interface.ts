import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { AsyncSingletonProxy } from '@/lib/utils';
import { Municipality } from '@/types';
import { Filter } from 'mongodb';

class MunicipalitiesClass extends MongoCollectionClass<Municipality> {
	private static _instance: MunicipalitiesClass;

	private constructor() {
		super();
	}

	public static async getInstance() {
		if (!MunicipalitiesClass._instance) {
			const instance = new MunicipalitiesClass();
			await instance.connect();
			MunicipalitiesClass._instance = instance;
		}
		return MunicipalitiesClass._instance;
	}

	protected getCollectionName() {
		return 'municipalities';
	}

	protected getDbUri() {
		return process.env.TML_INTERFACES_MUNICIPALITIES;
	}

	/**
	 * Finds a municipality by its code
	 *
	 * @param code - The code of the municipality to find
	 * @returns A promise that resolves to the matching municipality document or null if not found
	 */
	async findByCode(code: string) {
		return this.mongoCollection.findOne({ code } as Filter<Municipality>);
	}
}

export const municipalities = AsyncSingletonProxy(MunicipalitiesClass);

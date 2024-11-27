import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { AsyncSingletonProxy } from '@/lib/utils';
import { Agency, AgencySchema, CreateAgencyDto, UpdateAgencyDto, UpdateAgencySchema } from '@/types';
import { Filter } from 'mongodb';
import z from 'zod';

class AgenciesClass extends MongoCollectionClass<Agency, CreateAgencyDto, UpdateAgencyDto> {
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

	protected getCollectionName() {
		return 'agencies';
	}

	protected getCreateSchema(): z.ZodSchema {
		return AgencySchema;
	}

	protected getEnvName() {
		return 'TML_INTERFACES_AGENCIES';
	}

	protected getUpdateSchema(): z.ZodSchema {
		return UpdateAgencySchema;
	}

	async findByCode(code: string) {
		return this.mongoCollection.findOne({ code } as Filter<Agency>);
	}

	async updateByCode(code: string, fields: Partial<Agency>) {
		return this.mongoCollection.updateOne({ code } as Filter<Agency>, { $set: fields });
	}
}

export const agencies = AsyncSingletonProxy(AgenciesClass);

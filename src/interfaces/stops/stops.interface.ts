import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { CreateStopDto, Stop, UpdateStopDto } from '@/interfaces/stops/stop.type';
import { AsyncSingletonProxy } from '@/lib/utils';
import { Filter, IndexDescription, Sort } from 'mongodb';

class StopsClass extends MongoCollectionClass<Stop, CreateStopDto, UpdateStopDto> {
	private static _instance: StopsClass;

	private constructor() {
		super();
	}

	public static async getInstance() {
		if (!StopsClass._instance) {
			const instance = new StopsClass();
			await instance.connect();
			StopsClass._instance = instance;
		}
		return StopsClass._instance;
	}

	protected getCollectionIndexes(): IndexDescription[] {
		return [
			{ background: true, key: { code: 1 }, unique: true },
			{ background: true, key: { agency_id: 1 } },
			{ background: true, key: { municipality_id: 1 } },
			{ background: true, key: { name: 1 } },
		];
	}

	protected getCollectionName(): string {
		return 'stops';
	}

	protected getEnvName(): string {
		return 'TML_INTERFACES_STOPS';
	}

	/**
	 * Finds a stop document by its code.
	 *
	 * @param code - The code of the stop to find
	 * @returns A promise that resolves to the matching stop document or null if not found
	 */
	async findByCode(code: string) {
		return await this.mongoCollection.findOne({ code } as Filter<Stop>);
	}

	/**
	 * Finds stop documents by municipality code with optional pagination and sorting.
	 *
	 * @param code - The municipality code to search for
	 * @param perPage - Optional number of documents per page for pagination
	 * @param page - Optional page number for pagination
	 * @param sort - Optional sort specification
	 * @returns A promise that resolves to an array of matching stop documents
	 */
	async findByMunicipalityCode(code: string, perPage?: number, page?: number, sort?: Sort) {
		const query = this.mongoCollection.find({ municipality_code: code } as Filter<Stop>);
		if (perPage) query.limit(perPage);
		if (page && perPage) query.skip(perPage * (page - 1));
		if (sort) query.sort(sort);
		return query.toArray();
	}

	/**
	 * Finds multiple stop documents by their codes.
	 *
	 * @param codes - Array of stop codes to search for
	 * @returns A promise that resolves to an array of matching stop documents
	 */
	async findManyByCodes(codes: string[]) {
		return this.mongoCollection.find({ code: { $in: codes } } as Filter<Stop>).toArray();
	}

	/**
	 * Updates a stop document by its code.
	 *
	 * @param code - The code of the stop to update.
	 * @param updateFields - The fields to update in the stop document.
	 * @returns A promise that resolves to the result of the update operation.
	 */
	async updateByCode(code: string, updateFields: Partial<Stop>) {
		return this.mongoCollection.updateOne({ code } as Filter<Stop>, { $set: updateFields });
	}
}

// Create a proxy to delay access to methods until the instance is initialized
export const stops = AsyncSingletonProxy(StopsClass);

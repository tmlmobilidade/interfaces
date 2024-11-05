import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { Stop } from '@/types/stop';
import { Filter, Sort } from 'mongodb';

class StopsClass extends MongoCollectionClass<Stop> {
	private static _instance: StopsClass;

	private constructor() {
		super();
		this.connect(process.env.TML_INTERFACES_STOPS);
	}

	public static getInstance() {
		if (!StopsClass._instance) {
			StopsClass._instance = new StopsClass();
		}
		return StopsClass._instance;
	}

	protected getCollectionName() {
		return 'stops';
	}

	/**
	 * Finds a stop document by its code.
	 *
	 * @param code - The code of the stop to find
	 * @returns A promise that resolves to the matching stop document or null if not found
	 */
	async findByCode(code: string) {
		return this.mongoCollection.findOne({ code } as Filter<Stop>);
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
		if (page) query.skip(perPage * (page - 1));
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

export const stops = StopsClass.getInstance();

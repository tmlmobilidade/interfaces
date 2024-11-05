import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { HashedShape } from '@/types/ride';
import { Filter } from 'mongodb';
class HashedShapesClass extends MongoCollectionClass<HashedShape> {
	private static _instance: HashedShapesClass;

	private constructor() {
		super();
	}

	public static getInstance() {
		if (!HashedShapesClass._instance) {
			HashedShapesClass._instance = new HashedShapesClass();
		}
		return HashedShapesClass._instance;
	}

	protected getCollectionName() {
		return 'hashed_shapes';
	}

	protected getDbUri() {
		return process.env.TML_INTERFACES_RIDES;
	}

	/**
	 * Finds a ride document by its code.
	 *
	 * @param code - The code of the ride to find
	 * @returns A promise that resolves to the matching ride document or null if not found
	 */
	async findByCode(code: string) {
		return this.mongoCollection.findOne({ code } as Filter<HashedShape>);
	}

	/**
	 * Updates a stop document by its code.
	 *
	 * @param code - The code of the stop to update.
	 * @param updateFields - The fields to update in the stop document.
	 * @returns A promise that resolves to the result of the update operation.
	 */
	async updateByCode(code: string, updateFields: Partial<HashedShape>) {
		return this.mongoCollection.updateOne({ code } as Filter<HashedShape>, { $set: updateFields });
	}
}

export const hashedShapes = HashedShapesClass.getInstance();

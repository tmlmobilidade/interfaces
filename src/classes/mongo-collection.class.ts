import { MongoConnector } from '@/connectors/mongo.connector';
import { HttpException, HttpStatus } from '@/lib';
import { createSchemaFactory } from '@/lib/schema.factory';
import { generateRandomString } from '@/utils';
import { Collection, DeleteResult, Document, Filter, IndexDescription, InsertOneResult, MongoClientOptions, OptionalUnlessRequiredId, Sort, UpdateResult, WithId } from 'mongodb';
import z from 'zod';

export abstract class MongoCollectionClass<T extends Document, TCreate, TUpdate> {
	protected createSchema: null | z.ZodSchema = null;
	protected mongoCollection: Collection<T>;
	protected mongoConnector: MongoConnector;
	protected updateSchema: null | z.ZodSchema = null;

	/**
	 * Gets all documents in the collection.
	 *
	 * @returns A promise that resolves to an array of all documents
	 */
	async all() {
		return await this.mongoCollection.find().toArray();
	}

	/**
	 * Establishes a connection to the Mongo database and initializes the collection.
	 * @param options Optional Mongo client connection options
	 * @throws {Error} If connection fails
	 */
	async connect(options?: MongoClientOptions) {
		//

		const dbUri = process.env[this.getEnvName()];

		if (!dbUri) {
			throw new Error(`Missing ${this.getEnvName()} environment variable`);
		}

		try {
			// Connect to the MongoDB database
			this.mongoConnector = new MongoConnector(dbUri, options);
			await this.mongoConnector.connect();
			// Setup collection
			this.mongoCollection = this.mongoConnector.client.db('production').collection<T>(this.getCollectionName());
			// Create indexes, if any are defined
			// TODO: This should be refactored as indexes should be created in the database setup script
			if (process.env.NODE_ENV === 'test' && this.getCollectionIndexes().length > 0) {
				await this.mongoCollection.createIndexes(this.getCollectionIndexes());
			}
			// Create schemas, if any are defined
			const schemas = createSchemaFactory(this.getCollectionName());
			if (schemas) {
				this.createSchema = schemas[0];
				this.updateSchema = schemas[1];
			}
		}
		catch (error) {
			throw new Error(`Error connecting to ${this.getCollectionName()}`, { cause: error });
		}
	}

	/**
	 * Counts documents matching the filter criteria.
	 *
	 * @param filter - The filter criteria to match documents
	 * @returns A promise that resolves to the count of matching documents
	 */
	async count(filter?: Filter<T>): Promise<number> {
		return this.mongoCollection.countDocuments(filter);
	}

	/**
	 * Deletes a single document by its ID.
	 *
	 * @param id - The ID of the document to delete
	 * @returns A promise that resolves to the result of the delete operation
	 */
	async deleteById(id: string): Promise<DeleteResult> {
		return this.mongoCollection.deleteOne({ _id: { $eq: id } } as unknown as Filter<T>);
	}

	/**
	 * Deletes multiple documents matching the filter criteria.
	 *
	 * @param filter - The filter criteria to match documents to delete
	 * @returns A promise that resolves to the result of the delete operation
	 */
	async deleteMany(filter: Filter<T>): Promise<DeleteResult> {
		return this.mongoCollection.deleteMany(filter);
	}

	/**
	 * Deletes a single document matching the filter criteria.
	 *
	 * @param filter - The filter criteria to match the document to delete
	 * @returns A promise that resolves to the result of the delete operation
	 */
	async deleteOne(filter: Filter<T>): Promise<DeleteResult> {
		return this.mongoCollection.deleteOne(filter);
	}

	/**
	 * Disconnects from the MongoDB database.
	 */
	async disconnect() {
		await this.mongoConnector.disconnect();
	}

	/**
	 * Finds all distinct values for a key in the collection.
	 *
	 * @param key - The key to find distinct values for
	 * @returns A promise that resolves to an array of distinct values for the given key
	 */
	async distinct<K extends keyof T>(key: K): Promise<T[K][]> {
		return this.mongoCollection.distinct(key as string);
	}

	/**
	 * Finds a document by its ID.
	 *
	 * @param id - The ID of the document to find
	 * @returns A promise that resolves to the matching document or null if not found
	 */
	async findById(id: string): Promise<null | WithId<T>> {
		return this.mongoCollection.findOne({ _id: { $eq: id } } as unknown as Filter<T>);
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
	async findMany(filter?: Filter<T>, perPage?: number, page?: number, sort?: Sort): Promise<WithId<T>[]> {
		const query = this.mongoCollection.find(filter ?? {});
		if (perPage) query.limit(perPage);
		if (page && perPage) query.skip(perPage * (page - 1));
		if (sort) query.sort(sort);
		return query.toArray();
	}

	/**
	 * Finds a single document matching the filter criteria.
	 *
	 * @param filter - The filter criteria to match the document
	 * @returns A promise that resolves to the matching document or null if not found
	 */
	async findOne(filter: Filter<T>): Promise<null | WithId<T>> {
		return this.mongoCollection.findOne(filter);
	}

	/**
	 * Gets the MongoDB collection instance.
	 *
	 * @returns The MongoDB collection instance
	 */
	async getCollection(): Promise<Collection<T>> {
		return this.mongoCollection;
	}

	/**
	 * Inserts a single document into the collection.
	 *
	 * @param doc - The document to insert
	 * @returns A promise that resolves to the result of the insert operation
	 */
	async insertOne(doc: TCreate & { _id?: string, created_at?: Date, updated_at?: Date }, { unsafe = false } = {}): Promise<InsertOneResult<T>> {
		const newDocument = {
			...doc,
			_id: doc._id || generateRandomString({ length: 5 }),
			created_at: doc.created_at || new Date(),
			updated_at: doc.updated_at || new Date(),
		} as unknown as OptionalUnlessRequiredId<T>;

		if (!doc._id) {
			while (await this.findById(newDocument._id)) {
				newDocument._id = generateRandomString({ length: 5 });
			}
		}

		let parsedDocument = newDocument;
		if (!unsafe) {
			try {
				if (!this.createSchema) {
					throw new Error('No schema defined for insert operation. This is either an internal interface error or you should pass unsafe=true to the insert operation.');
				}
				parsedDocument = this.createSchema.parse(newDocument);
			}
			catch (error) {
				throw new HttpException(HttpStatus.BAD_REQUEST, error.message, { cause: error });
			}
		}

		return this.mongoCollection.insertOne(parsedDocument);
	}

	/**
	 * Updates a single document matching the filter criteria.
	 *
	 * @param filter - The filter criteria to match the document to update
	 * @param updateFields - The fields to update in the document
	 * @returns A promise that resolves to the result of the update operation
	 */
	async updateById(id: string, updateFields: TUpdate): Promise<UpdateResult> {
		return this.updateOne({ _id: { $eq: id } } as unknown as Filter<T>, updateFields);
	}

	// /**
	//  * Inserts multiple documents into the collection.
	//  *
	//  * @param docs - Array of documents to insert
	//  * @returns A promise that resolves to the result of the insert operation
	//  */
	// async insertMany(docs: OptionalUnlessRequiredId<T>[]) {
	// 	if (this.createSchema) {
	// 		for (const doc of docs) {
	// 			try {
	// 				this.createSchema.parse(doc);
	// 			}
	// 			catch (error) {
	// 				throw new HttpException(HttpStatus.BAD_REQUEST, error.message, { cause: error });
	// 			}
	// 		}
	// 	}

	// 	return this.mongoCollection.insertMany(docs.map(doc => ({ ...doc, created_at: new Date(), updated_at: new Date() })));
	// }

	/**
	 * Updates multiple documents matching the filter criteria.
	 *
	 * @param filter - The filter criteria to match documents to update
	 * @param updateFields - The fields to update in the documents
	 * @returns A promise that resolves to the result of the update operation
	 */
	async updateMany(filter: Filter<T>, updateFields: Partial<T>) {
		let parsedUpdateFields = updateFields;
		if (this.updateSchema) {
			try {
				parsedUpdateFields = this.updateSchema.parse(updateFields);
			}
			catch (error) {
				throw new HttpException(HttpStatus.BAD_REQUEST, error.message, { cause: error });
			}
		}

		return this.mongoCollection.updateMany(filter, { $set: { ...parsedUpdateFields, updated_at: new Date() } } as unknown as Partial<T>);
	}

	/**
	 * Updates a single document matching the filter criteria.
	 *
	 * @param filter - The filter criteria to match the document to update
	 * @param updateFields - The fields to update in the document
	 * @returns A promise that resolves to the result of the update operation
	 */
	async updateOne(filter: Filter<T>, updateFields: TUpdate): Promise<UpdateResult> {
		let parsedUpdateFields = updateFields;
		if (this.updateSchema) {
			try {
				parsedUpdateFields = this.updateSchema.parse(updateFields);
			}
			catch (error) {
				throw new HttpException(HttpStatus.BAD_REQUEST, error.message, { cause: error });
			}
		}

		return this.mongoCollection.updateOne(filter, { $set: { ...parsedUpdateFields, updated_at: new Date() } } as unknown as Partial<T>);
	}

	// Abstract method for subclasses to provide the MongoDB collection indexes
	protected abstract getCollectionIndexes(): IndexDescription[];

	// Abstract method for subclasses to provide the MongoDB collection name
	protected abstract getCollectionName(): string;

	// Abstract method for subclasses to provide the environment variable name
	protected abstract getEnvName(): string;
}

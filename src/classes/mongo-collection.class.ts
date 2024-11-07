import { MongoConnector } from '@/connectors/mongo.connector';
import { Collection, Filter, MongoClientOptions, ObjectId, OptionalUnlessRequiredId, Sort } from 'mongodb';

export abstract class MongoCollectionClass<T> {
	protected mongoCollection: Collection<T>;
	protected mongoConnector: MongoConnector;

	// Abstract method for subclasses to provide the MongoDB collection name
	protected abstract getCollectionName(): string;

	// Abstract method for subclasses to provide the MongoDB database URI
	protected abstract getDbUri(): string;

	/**
	 * Establishes a connection to the Mongo database and initializes the collection.
	 * @param options Optional Mongo client connection options
	 * @throws {Error} If connection fails
	 */
	async connect(options?: MongoClientOptions) {
		try {
			console.log(`⤷ Connecting to ${this.getCollectionName()}...`);
			this.mongoConnector = new MongoConnector(this.getDbUri(), options);
			await this.mongoConnector.connect();
			this.mongoCollection = await this.mongoConnector.getCollection<T>(
				this.mongoConnector.client.db('production'),
				this.getCollectionName(),
			);
			console.log(`⤷ Connected to ${this.getCollectionName()}.`);
		}
		catch (error) {
			throw new Error(`Error connecting to ${this.getCollectionName()}`);
		}
	}

	/**
	 * Counts documents matching the filter criteria.
	 *
	 * @param filter - The filter criteria to match documents
	 * @returns A promise that resolves to the count of matching documents
	 */
	async count(filter?: Filter<T>) {
		return this.mongoCollection.countDocuments(filter);
	}

	/**
	 * Deletes multiple documents matching the filter criteria.
	 *
	 * @param filter - The filter criteria to match documents to delete
	 * @returns A promise that resolves to the result of the delete operation
	 */
	async deleteMany(filter: Filter<T>) {
		return this.mongoCollection.deleteMany(filter);
	}

	/**
	 * Disconnects from the MongoDB database.
	 */
	async disconnect() {
		await this.mongoConnector.disconnect();
	}

	/**
	 * Finds a document by its ID.
	 *
	 * @param id - The ID of the document to find
	 * @returns A promise that resolves to the matching document or null if not found
	 */
	async findById(id: string) {
		return this.mongoCollection.findOne({ _id: new ObjectId(id) } as unknown as Filter<T>);
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
	async findMany(filter?: Filter<T>, perPage?: number, page?: number, sort?: Sort) {
		const query = this.mongoCollection.find(filter);
		if (perPage) query.limit(perPage);
		if (page && perPage) query.skip(perPage * (page - 1));
		if (sort) query.sort(sort);
		return query.toArray();
	}

	/**
	 * Inserts multiple documents into the collection.
	 *
	 * @param docs - Array of documents to insert
	 * @returns A promise that resolves to the result of the insert operation
	 */
	async insertMany(docs: OptionalUnlessRequiredId<T>[]) {
		return this.mongoCollection.insertMany(docs);
	}

	/**
	 * Inserts a single document into the collection.
	 *
	 * @param doc - The document to insert
	 * @returns A promise that resolves to the result of the insert operation
	 */
	async insertOne(doc: OptionalUnlessRequiredId<T>) {
		return this.mongoCollection.insertOne(doc);
	}

	/**
	 * Updates a single document matching the filter criteria.
	 *
	 * @param filter - The filter criteria to match the document to update
	 * @param updateFields - The fields to update in the document
	 * @returns A promise that resolves to the result of the update operation
	 */
	async update(filter: Filter<T>, updateFields: Partial<T>) {
		return this.mongoCollection.updateOne(filter, { $set: updateFields });
	}

	/**
	 * Updates multiple documents matching the filter criteria.
	 *
	 * @param filter - The filter criteria to match documents to update
	 * @param updateFields - The fields to update in the documents
	 * @returns A promise that resolves to the result of the update operation
	 */
	async updateMany(filter: Filter<T>, updateFields: Partial<T>) {
		return this.mongoCollection.updateMany(filter, { $set: updateFields });
	}

	/**
	 * Gets all documents in the collection.
	 *
	 * @returns A promise that resolves to an array of all documents
	 */
	get all() {
		return this.mongoCollection.find().toArray();
	}

	/**
	 * Gets the MongoDB collection instance.
	 *
	 * @returns The MongoDB collection instance
	 */
	get collection(): Collection<T> {
		return this.mongoCollection;
	}
}

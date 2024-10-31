/* * */

import { MongoService } from '@/services/mongo.service.js';
import { Stop } from '@/types/stop';
import { Collection, MongoClientOptions } from 'mongodb';

/* * */

class StopsClass {
	private static _instance: StopsClass;
	private mongoService: MongoService;
	private stopsCollection: Collection<Stop>;

	public static getInstance() {
		if (!StopsClass._instance) {
			StopsClass._instance = new StopsClass();
		}

		return StopsClass._instance;
	}

	//
	// Methods

	/**
	 * Establishes a connection to the Mongo database and initializes the stops collection.
	 * @param options Optional Mongo client connection options
	 * @throws {Error} If connection to Stops fails
	 */
	async connect(options?: MongoClientOptions) {
		try {
			// Connect to the Mongo service
			this.mongoService = MongoService.getInstance(process.env.TML_INTERFACES_STOPS, options);
			await this.mongoService.connect();

			this.stopsCollection = await this.mongoService.getCollection<Stop>(this.mongoService.client.db('production'), 'stops');

			console.log(`⤷ Connected to Stops.`);
		}
		catch (error) {
			throw new Error('Error connecting to Stops', error);
		}
	}

	/**
	 * Disconnects from the Mongo database.
	 */
	async disconnect() {
		await this.mongoService.disconnect();
	}

	/**
	 * Returns an array containing all stops in the collection.
	 * @returns Promise that resolves to an array of all stops
	 */
	get all() {
		return this.stopsCollection.find().toArray();
	}

	/**
	 * Gets the stops collection instance.
	 * @returns The Mongo collection for stops
	 */
	get collection(): Collection<Stop> {
		return this.stopsCollection;
	}
}

export const Stops = StopsClass.getInstance();

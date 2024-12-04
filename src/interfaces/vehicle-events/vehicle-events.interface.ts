/* * */

import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { CreateVehicleEventDto, UpdateVehicleEventDto, VehicleEvent } from '@/interfaces/vehicle-events/vehicle-event.type';
import { AsyncSingletonProxy } from '@/lib/utils';
import { Filter, IndexDescription } from 'mongodb';

/* * */

class VehicleEventsClass extends MongoCollectionClass<VehicleEvent, CreateVehicleEventDto, UpdateVehicleEventDto> {
	private static _instance: VehicleEventsClass;

	private constructor() {
		super();
	}

	public static async getInstance() {
		if (!VehicleEventsClass._instance) {
			const instance = new VehicleEventsClass();
			await instance.connect();
			VehicleEventsClass._instance = instance;
		}
		return VehicleEventsClass._instance;
	}

	protected getCollectionIndexes(): IndexDescription[] {
		return [
			{ background: true, key: { agency_id: 1 } },
			{ background: true, key: { line_id: 1 } },
			{ background: true, key: { route_id: 1 } },
			{ background: true, key: { pattern_id: 1 } },
			{ background: true, key: { trip_id: 1 } },
			{ background: true, key: { stop_id: 1 } },
			{ background: true, key: { vehicle_id: 1 } },
			{ background: true, key: { vehicle_timestamp: -1 } },
			{ background: true, key: { operational_date: -1 } },
		];
	}

	protected getCollectionName(): string {
		return 'vehicle_events';
	}

	protected getEnvName(): string {
		return 'TML_INTERFACE_VEHICLE_EVENTS';
	}

	/**
	 * Finds apexLocation documents by agency ID.
	 *
	 * @param id - The agency ID to search for
	 * @returns A promise that resolves to an array of matching apexLocation documents
	 */
	async findByAgencyId(id: string) {
		return this.mongoCollection.find({ agency_id: id } as Filter<VehicleEvent>).toArray();
	}

	/**
	 * Finds a apexLocation document by its code.
	 *
	 * @param code - The code of the apexLocation to find
	 * @returns A promise that resolves to the matching apexLocation document or null if not found
	 */
	async findByCode(code: string) {
		return this.mongoCollection.findOne({ code } as Filter<VehicleEvent>);
	}

	/**
	 * Updates a stop document by its code.
	 *
	 * @param code - The code of the stop to update.
	 * @param updateFields - The fields to update in the stop document.
	 * @returns A promise that resolves to the result of the update operation.
	 */
	async updateByCode(code: string, updateFields: Partial<VehicleEvent>) {
		return this.mongoCollection.updateOne({ code } as Filter<VehicleEvent>, { $set: updateFields });
	}
}

/* * */

export const vehicleEvents = AsyncSingletonProxy(VehicleEventsClass);

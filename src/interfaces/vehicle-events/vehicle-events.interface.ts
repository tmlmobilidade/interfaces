/* * */

import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { VehicleEvent } from '@/interfaces/vehicle-events/vehicle-event.type';
import { AsyncSingletonProxy } from '@/lib/utils';
import { IndexDescription } from 'mongodb';

/* * */

class VehicleEventsClass extends MongoCollectionClass<VehicleEvent, VehicleEvent, VehicleEvent> {
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
			{ background: true, key: { operational_date: -1 } },
			// eslint-disable-next-line perfectionist/sort-objects
			{ background: true, key: { operational_date: -1, agency_id: 1 } },
			{ background: true, key: { operational_date: -1, pattern_id: 1 } },
			{ background: true, key: { operational_date: -1, trip_id: 1 } },
			{ background: true, key: { operational_date: -1, vehicle_id: 1 } },
		];
	}

	protected getCollectionName(): string {
		return 'vehicle_events';
	}

	protected getEnvName(): string {
		return 'TML_INTERFACE_VEHICLE_EVENTS';
	}
}

/* * */

export const vehicleEvents = AsyncSingletonProxy(VehicleEventsClass);

import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { AsyncSingletonProxy } from '@/lib/utils';
import { Alert } from '@/types';
import { Filter } from 'mongodb';

class AlertsClass extends MongoCollectionClass<Alert> {
	private static _instance: AlertsClass;

	private constructor() {
		super();
	}

	public static async getInstance() {
		if (!AlertsClass._instance) {
			const instance = new AlertsClass();
			await instance.connect();
			AlertsClass._instance = instance;
		}
		return AlertsClass._instance;
	}

	protected getCollectionName(): string {
		return 'alerts';
	}

	protected getDbUri(): string {
		return process.env.TML_INTERFACES_ALERTS;
	}

	async findByAgencyId(agency_id: string) {
		return this.mongoCollection.find({ agency_ids: { $in: [agency_id] } } as Filter<Alert>).toArray();
	}

	async findByLineId(line_id: string) {
		return this.mongoCollection.find({ line_ids: { $in: [line_id] } } as Filter<Alert>).toArray();
	}

	async findByMunicipalityId(municipality_id: string) {
		return this.mongoCollection.find({ municipality_ids: { $in: [municipality_id] } } as Filter<Alert>).toArray();
	}

	async findByRouteId(route_id: string) {
		return this.mongoCollection.find({ route_ids: { $in: [route_id] } } as Filter<Alert>).toArray();
	}

	async findByStopId(stop_id: string) {
		return this.mongoCollection.find({ stop_ids: { $in: [stop_id] } } as Filter<Alert>).toArray();
	}

	async findByTitle(title: string) {
		return this.mongoCollection.findOne({ title } as Filter<Alert>);
	}
}

export const alerts = AsyncSingletonProxy(AlertsClass);

/* * */

import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { AsyncSingletonProxy } from '@/lib/utils';
import { Alert, CreateAlertDto, UpdateAlertDto } from '@/types';
import { Filter, IndexDescription } from 'mongodb';

/* * */

class AlertsClass extends MongoCollectionClass<Alert, CreateAlertDto, UpdateAlertDto> {
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

	protected getCollectionIndexes(): IndexDescription[] {
		return [
			{ background: true, key: { agency_ids: 1 } },
			{ background: true, key: { line_ids: 1 } },
			{ background: true, key: { municipality_ids: 1 } },
			{ background: true, key: { route_ids: 1 } },
			{ background: true, key: { stop_ids: 1 } },
			{ background: true, key: { title: 1 } },
			{ background: true, key: { active_period_end_date: -1, active_period_start_date: -1 } },
			{ background: true, key: { publish_end_date: -1, publish_start_date: -1 } },
		];
	}

	protected getCollectionName(): string {
		return 'alerts';
	}

	protected getEnvName(): string {
		return 'TML_INTERFACE_ALERTS';
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

/* * */

export const alerts = AsyncSingletonProxy(AlertsClass);

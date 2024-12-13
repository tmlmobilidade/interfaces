/* * */

import { createOperationalDate, DocumentSchema, OperationalDate } from '@/types/common';
import { z } from 'zod';

/* * */

export const VehicleEventSchema = DocumentSchema.extend({
	agency_id: z.string(),
	driver_id: z.string(),
	event_id: z.string(),
	extra_trip_id: z.string().nullable(),
	latitude: z.number(),
	longitude: z.number(),
	odometer: z.number(),
	operational_date: z.string().transform(createOperationalDate).brand('OperationalDate'),
	pattern_id: z.string(),
	received_at: z.coerce.date(),
	stop_id: z.string(),
	trigger_activity: z.string(),
	trigger_door: z.string(),
	trip_id: z.string(),
	vehicle_id: z.string(),
}).strict();

/**
 * Vehicle Events are produced by the vehicle's on-board computer on a regular schedule
 * or whenever a significant event occurs. These events are used to track the vehicle's
 * location, speed, and status, as well as the current service being provided by the vehicle.
 * These events are based on the GTFS-RT specification but extended with additional fields
 * specific to TML's needs.
 */
export interface VehicleEvent extends Omit<z.infer<typeof VehicleEventSchema>, 'operational_date'> {
	operational_date: OperationalDate
}

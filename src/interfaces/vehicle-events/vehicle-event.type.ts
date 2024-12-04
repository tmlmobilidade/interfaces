/* * */

import { createOperationalDate, DocumentSchema, OperationalDate } from '@/types/common';
import { z } from 'zod';

/* * */

export const VehicleEventSchema = DocumentSchema.extend({
	agency_id: z.string(),
	data: z.string(),
	event_id: z.string(),
	insert_timestamp: z.date(),
	line_id: z.string(),
	odometer: z.number(),
	operational_date: z.string().transform(createOperationalDate).brand('OperationalDate'),
	pattern_id: z.string(),
	route_id: z.string(),
	stop_id: z.string(),
	trip_id: z.string(),
	vehicle_id: z.string(),
	vehicle_timestamp: z.date(),
}).strict();

export const CreateVehicleEventSchema = VehicleEventSchema.partial({
	created_at: true,
	updated_at: true,
});
export const UpdateVehicleEventSchema = CreateVehicleEventSchema.partial().omit({ _id: true, created_at: true, updated_at: true });

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

export interface CreateVehicleEventDto extends Omit<z.infer<typeof CreateVehicleEventSchema>, 'operational_date'> {
	operational_date: OperationalDate
}

export type UpdateVehicleEventDto = Partial<CreateVehicleEventDto>;

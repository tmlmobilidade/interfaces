/* * */

import { createOperationalDate, DocumentSchema, OperationalDate } from '@/types/common';
import { z } from 'zod';

/* * */

export const VehicleEventSchema = DocumentSchema.extend({
	agency_id: z.string(),
	data: z.string(),
	line_id: z.string(),
	odometer: z.number(),
	operational_day: z.string().transform(createOperationalDate).brand('OperationalDate'),
	pattern_id: z.string(),
	pcgi_id: z.string(),
	route_id: z.string(),
	stop_id: z.string(),
	trip_id: z.string(),
	updated_at: z.date(),
	vehicle_id: z.string(),
	vehicle_timestamp: z.number(),
}).strict();

export const CreateVehicleEventSchema = VehicleEventSchema.partial({
	_id: true,
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
export type VehicleEvent = { operational_day: OperationalDate } & Omit<z.infer<typeof VehicleEventSchema>, 'operational_day'>;

export type CreateVehicleEventDto = { operational_day: OperationalDate } & Omit<z.infer<typeof CreateVehicleEventSchema>, 'operational_day'>;
export type UpdateVehicleEventDto = Partial<CreateVehicleEventDto>;

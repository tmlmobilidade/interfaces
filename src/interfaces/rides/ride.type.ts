/* * */

import { createOperationalDate, DocumentSchema, OperationalDate } from '@/types/common';
import { z } from 'zod';

/* * */

export const RideAnalysisSchema = z.object({
	_id: z.string(),
	grade: z.enum(['pass', 'fail', 'error']),
	message: z.string().nullable(),
	reason: z.string().nullable(),
	unit: z.string().nullable(),
	value: z.number().nullable(),
}).strict();

export const CreateRideAnalysisSchema = RideAnalysisSchema;
export const UpdateRideAnalysisSchema = RideAnalysisSchema.partial();

export type RideAnalysis = z.infer<typeof RideAnalysisSchema>;
export type CreateRideAnalysisDto = z.infer<typeof CreateRideAnalysisSchema>;
export type UpdateRideAnalysisDto = Partial<CreateRideAnalysisDto>;

/* * */

export const RideSchema = DocumentSchema.extend({
	agency_id: z.string(),
	analysis: z.array(RideAnalysisSchema),
	driver_ids: z.array(z.string()),
	end_time_observed: z.coerce.date().nullable(),
	end_time_scheduled: z.coerce.date(),
	execution_status: z.enum(['success', 'failure', 'warning']).nullable(),
	extension_observed: z.number().nullable(),
	extension_scheduled: z.number(),
	hashed_shape_id: z.string(),
	hashed_trip_id: z.string(),
	headsign: z.string(),
	line_id: z.string(),
	operational_date: z.string().transform(createOperationalDate).brand('OperationalDate'),
	passengers_estimated: z.number().nullable(),
	pattern_id: z.string(),
	plan_id: z.string(),
	route_id: z.string(),
	seen_first_at: z.coerce.date().nullable(),
	seen_last_at: z.coerce.date().nullable(),
	start_time_observed: z.coerce.date().nullable(),
	start_time_scheduled: z.coerce.date(),
	system_status: z.enum(['pending', 'processing', 'complete', 'error']),
	trip_id: z.string(),
	validations_count: z.number().nullable(),
	vehicle_ids: z.array(z.string()),
}).strict();

export const CreateRideSchema = RideSchema.partial({ _id: true }).omit({ created_at: true, updated_at: true });
export const UpdateRideSchema = CreateRideSchema.partial();

export interface Ride extends Omit<z.infer<typeof RideSchema>, 'operational_date'> {
	operational_date: OperationalDate
}

export interface CreateRideDto extends Omit<z.infer<typeof CreateRideSchema>, 'operational_date'> {
	operational_date: OperationalDate
}

export type UpdateRideDto = Partial<CreateRideDto>;

/* * */

export const RideDisplaySchema = RideSchema.extend({
	operational_status: z.enum(['scheduled', 'missed', 'running', 'ended']),
	seen_status: z.enum(['unseen', 'seen', 'gone']),
}).strict();

export interface RideDisplay extends Omit<z.infer<typeof RideDisplaySchema>, 'operational_date'> {
	operational_date: OperationalDate
}

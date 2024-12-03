/* * */

import { createOperationalDate, DocumentSchema, OperationalDate } from '@/types/common';
import { z } from 'zod';

/* * */

export const RideAnalysisSchema = z.object({
	_id: z.string(),
	grade: z.enum(['pass', 'fail', 'error']),
	message: z.string().nullable(),
	reason: z.string().nullable(),
	timestamp: z.date(),
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
	driver_id: z.string().nullable(),
	extension_observed: z.number().nullable(),
	extension_scheduled: z.number(),
	hashed_shape_id: z.string(),
	hashed_trip_id: z.string(),
	headsign: z.string(),
	line_id: z.string(),
	line_type: z.number(),
	operational_date: z.string().transform(createOperationalDate).brand('OperationalDate'),
	passengers_estimated: z.number().nullable(),
	pattern_id: z.string(),
	plan_id: z.string(),
	refunds_amount: z.number().nullable(),
	refunds_count: z.number().nullable(),
	route_id: z.string(),
	runtime_observed: z.number().nullable(),
	runtime_scheduled: z.number(),
	sales_amount: z.number().nullable().nullable(),
	sales_count: z.number().nullable().nullable(),
	start_time_observed: z.string().nullable(),
	start_time_observed_unix: z.string().nullable(),
	start_time_scheduled: z.string(),
	start_time_scheduled_unix: z.string(),
	status: z.enum(['pending', 'processing', 'complete', 'error']),
	trip_id: z.string(),
	validations_count: z.number().nullable(),
	vehicle_id: z.string().nullable(),
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

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
	extension: z.number(),
	hashed_shape_id: z.string(),
	hashed_trip_id: z.string(),
	line_id: z.string(),
	operational_day: z.string().transform(createOperationalDate).brand('OperationalDate'),
	pattern_id: z.string(),
	plan_id: z.string(),
	route_id: z.string(),
	scheduled_start_time: z.string(),
	service_id: z.string(),
	status: z.enum(['pending', 'processing', 'complete', 'error']),
	trip_id: z.string(),
}).strict();

export const CreateRideSchema = RideSchema.omit({ _id: true, created_at: true, updated_at: true });
export const UpdateRideSchema = CreateRideSchema.partial();

export interface Ride extends Omit<z.infer<typeof RideSchema>, 'operational_day'> {
	operational_day: OperationalDate
}

export interface CreateRideDto extends Omit<z.infer<typeof CreateRideSchema>, 'operational_day'> {
	operational_day: OperationalDate
}

export type UpdateRideDto = Partial<CreateRideDto>;

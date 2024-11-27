/* * */

import { DocumentSchema } from '@/types/common';
import { z } from 'zod';

/* * */

export const RideAnalysisSchema = z.object({
	code: z.string(),
	grade: z.string(),
	message: z.union([z.string().nullable(), z.null()]),
	reason: z.union([z.string().nullable(), z.null()]),
	status: z.string(),
	unit: z.union([z.string().nullable(), z.null()]),
	value: z.union([z.number().nullable(), z.null()]),
}).strict();

export const CreateRideAnalysisSchema = RideAnalysisSchema;
export const UpdateRideAnalysisSchema = RideAnalysisSchema.partial();

export type RideAnalysis = z.infer<typeof RideAnalysisSchema>;
export type CreateRideAnalysisDto = RideAnalysis;
export type UpdateRideAnalysisDto = Partial<RideAnalysis>;

/* * */

export const RideSchema = DocumentSchema.extend({
	agency_id: z.string(),
	analysis: z.array(RideAnalysisSchema),
	analysis_timestamp: z.union([z.string().nullable(), z.null()]),
	archive_id: z.string(),
	code: z.string(),
	hashed_shape_code: z.string(),
	hashed_trip_code: z.string(),
	line_id: z.string(),
	operational_day: z.string(),
	parse_timestamp: z.object({
		$date: z.string(),
	}),
	pattern_id: z.string(),
	route_id: z.string(),
	scheduled_start_time: z.string(),
	service_id: z.string(),
	status: z.string(),
	trip_id: z.string(),
	user_notes: z.string(),
}).strict();

export const CreateRideSchema = RideSchema.omit({ _id: true, created_at: true, updated_at: true });
export const UpdateRideSchema = CreateRideSchema.partial();

export type Ride = z.infer<typeof RideSchema>;
export type CreateRideDto = z.infer<typeof CreateRideSchema>;
export type UpdateRideDto = Partial<CreateRideDto>;

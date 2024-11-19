import { z } from 'zod';

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

export const RideSchema = z.object({
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

export const CreateRideSchema = RideSchema;
export const UpdateRideSchema = RideSchema.partial();

export const HashedShapePointSchema = z.object({
	shape_pt_lat: z.string(),
	shape_pt_lon: z.string(),
	shape_pt_sequence: z.number(),
}).strict();

export const CreateHashedShapePointSchema = HashedShapePointSchema;
export const UpdateHashedShapePointSchema = HashedShapePointSchema.partial();

export const HashedShapeSchema = z.object({
	agency_id: z.string(),
	code: z.string(),
	points: z.array(HashedShapePointSchema),
	shape_id: z.string(),
}).strict();

export const CreateHashedShapeSchema = HashedShapeSchema;
export const UpdateHashedShapeSchema = HashedShapeSchema.partial();

export const HashedTripStopSchema = z.object({
	arrival_time: z.string(),
	departure_time: z.string(),
	drop_off_type: z.string(),
	pickup_type: z.string(),
	stop_id: z.string(),
	stop_lat: z.string(),
	stop_lon: z.string(),
	stop_name: z.string(),
	stop_sequence: z.number(),
	timepoint: z.string(),
}).strict();

export const CreateHashedTripStopSchema = HashedTripStopSchema;
export const UpdateHashedTripStopSchema = HashedTripStopSchema.partial();

export const HashedTripSchema = z.object({
	agency_id: z.string(),
	code: z.string(),
	line_id: z.string(),
	line_long_name: z.string(),
	line_short_name: z.string(),
	path: z.array(HashedTripStopSchema),
	pattern_id: z.string(),
	route_color: z.string(),
	route_id: z.string(),
	route_long_name: z.string(),
	route_short_name: z.string(),
	route_text_color: z.string(),
	trip_headsign: z.string(),
}).strict();

export const CreateHashedTripSchema = HashedTripSchema;
export const UpdateHashedTripSchema = HashedTripSchema.partial();

export type RideAnalysis = z.infer<typeof RideAnalysisSchema>;
export type CreateRideAnalysisDto = RideAnalysis;
export type UpdateRideAnalysisDto = Partial<RideAnalysis>;

export type Ride = z.infer<typeof RideSchema>;
export type CreateRideDto = Ride;
export type UpdateRideDto = Partial<Ride>;

export type HashedShapePoint = z.infer<typeof HashedShapePointSchema>;
export type CreateHashedShapePointDto = HashedShapePoint;
export type UpdateHashedShapePointDto = Partial<HashedShapePoint>;

export type HashedShape = z.infer<typeof HashedShapeSchema>;
export type CreateHashedShapeDto = HashedShape;
export type UpdateHashedShapeDto = Partial<HashedShape>;

export type HashedTripStop = z.infer<typeof HashedTripStopSchema>;
export type CreateHashedTripStopDto = HashedTripStop;
export type UpdateHashedTripStopDto = Partial<HashedTripStop>;

export type HashedTrip = z.infer<typeof HashedTripSchema>;
export type CreateHashedTripDto = HashedTrip;
export type UpdateHashedTripDto = Partial<HashedTrip>;

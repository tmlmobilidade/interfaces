/* * */

import { z } from 'zod';

/* * */

export const HashedTripWaypointSchema = z.object({
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

export const CreateHashedTripWaypointSchema = HashedTripWaypointSchema;
export const UpdateHashedTripWaypointSchema = HashedTripWaypointSchema.partial();

export type HashedTripWaypoint = z.infer<typeof HashedTripWaypointSchema>;
export type CreateHashedTripWaypointDto = HashedTripWaypoint;
export type UpdateHashedTripWaypointDto = Partial<HashedTripWaypoint>;

/* * */

export const HashedTripSchema = z.object({
	agency_id: z.string(),
	code: z.string(),
	line_id: z.string(),
	line_long_name: z.string(),
	line_short_name: z.string(),
	path: z.array(HashedTripWaypointSchema),
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

export type HashedTrip = z.infer<typeof HashedTripSchema>;
export type CreateHashedTripDto = HashedTrip;
export type UpdateHashedTripDto = Partial<HashedTrip>;

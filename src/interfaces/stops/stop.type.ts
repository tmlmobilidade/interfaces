/* * */

import { CommentSchema, DocumentSchema } from '@/types/common';
import z from 'zod';

/* * */

export const StopSchema = DocumentSchema.extend({

	//
	// General

	_id: z.string().length(6),
	latitude: z.number(),
	longitude: z.number(),
	name: z.string(),
	operational_status: z
		.enum(['active', 'inactive', 'provisional', 'seasonal', 'voided'])
		.default('inactive'),
	short_name: z.string().optional(),
	tts_name: z.string().optional(),

	//
	// Location

	district_id: z.string(),
	jurisdiction: z
		.enum(['ip', 'municipality', 'other', 'unknown'])
		.default('unknown'),
	locality_id: z.string().optional(),
	municipality_id: z.string(),
	parish_id: z.string().optional(),
	region_id: z.string(),
	road_type: z
		.enum(['complementary_itinerary', 'highway', 'main_itinerary', 'national_road', 'regional_road', 'secondary_road', 'unknown'])
		.default('unknown'),

	//
	// Infrastructure

	bench_status: z
		.enum(['not_applicable', 'unknown', 'is_missing', 'is_damaged', 'is_ok'])
		.default('unknown'),
	docking_bay_type: z
		.enum(['unknown', 'simple_interaction', 'cut_in_road_without_marks', 'cut_in_road_with_marks', 'island', 'peninsula'])
		.default('unknown'),
	electricity_status: z
		.enum(['available', 'unavailable', 'unknown'])
		.default('unknown'),
	flag_status: z
		.enum(['not_applicable', 'unknown', 'is_missing', 'is_damaged', 'is_ok'])
		.default('unknown'),
	lighting_status: z
		.enum(['confortable', 'damaged', 'insuficient', 'moderate', 'unavailable', 'unknown'])
		.default('unknown'),
	pavement_type: z
		.enum(['asphalt', 'concrete', 'dirt', 'grass', 'gravel', 'portuguese_stones', 'unknown'])
		.default('unknown'),
	pole_status: z
		.enum(['not_applicable', 'unknown', 'is_missing', 'is_damaged', 'is_ok'])
		.default('unknown'),
	shelter_code: z.string().optional(),
	shelter_maintainer: z.string().optional(),
	shelter_make: z.string().optional(),
	shelter_model: z.string().optional(),
	shelter_status: z
		.enum(['not_applicable', 'unknown', 'is_missing', 'is_damaged', 'is_ok'])
		.default('unknown'),
	sidewalk_type: z
		.enum(['unknown', 'none', 'gutter', 'inaccessible', 'is_ok'])
		.default('unknown'),

	//
	// Checks

	last_infrastructure_check: z.coerce.date().optional(),
	last_infrastructure_maintenance: z.coerce.date().optional(),
	last_schedules_check: z.coerce.date().optional(),
	last_schedules_maintenance: z.coerce.date().optional(),

	//
	// Notes & Comments

	comments: z
		.array(CommentSchema)
		.default([]),

	//
	// Facilities

	connections: z
		.array(z.enum([
			'ferry',
			'light_rail',
			'subway',
			'train',
			'boat',
			'airport',
			'bike_sharing',
			'bike_parking',
			'car_parking',
		]))
		.default([]),

	facilities: z
		.array(z.enum([
			'fire_station',
			'health_clinic',
			'historic_building',
			'hospital',
			'police_station',
			'school',
			'shopping',
			'transit_office',
			'university',
			'pip',
		]))
		.default([]),

}).strict();

export const CreateStopSchema = StopSchema;
export const UpdateStopSchema = CreateStopSchema.partial();

export type Stop = z.infer<typeof StopSchema>;
export type CreateStopDto = z.infer<typeof CreateStopSchema>;
export type UpdateStopDto = Partial<CreateStopDto>;

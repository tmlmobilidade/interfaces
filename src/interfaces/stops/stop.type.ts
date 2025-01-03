/* * */

import { CommentSchema, DocumentSchema } from '@/types';
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

	address: z.string().optional(),
	district_id: z.string(),
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
	flag_status: z
		.enum(['not_applicable', 'unknown', 'is_missing', 'is_damaged', 'is_ok'])
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
	trash_bin_status: z
		.enum(['not_applicable', 'unknown', 'is_missing', 'is_damaged', 'is_ok'])
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

}).strict();

export const CreateStopSchema = StopSchema.omit({ created_at: true, updated_at: true });
export const UpdateStopSchema = CreateStopSchema.partial();

export type Stop = z.infer<typeof StopSchema>;
export type CreateStopDto = z.infer<typeof CreateStopSchema>;
export type UpdateStopDto = Partial<CreateStopDto>;

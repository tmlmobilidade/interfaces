/* * */

import { createOperationalDate } from '@/types/common';
import { z } from 'zod';

/* * */

export const PlanSchema = z.object({
	_id: z.string(),
	agency_id: z.string(),
	created_at: z.string(),
	gtfs_operation: z.string(),
	gtfs_reference: z.string(),
	is_locked: z.string(),
	parsed_dates: z.array(z.string().transform(createOperationalDate).brand('OperationalDate')),
	status: z.string(),
	updated_at: z.string(),
	valid_from: z.string(),
	valid_until: z.string(),
}).strict();

export const CreatePlanSchema = PlanSchema;
export const UpdatePlanSchema = PlanSchema.partial();

/* * */

export type Plan = z.infer<typeof PlanSchema>;

export type CreatePlanDto = Plan;

export type UpdatePlanDto = Partial<Plan>;

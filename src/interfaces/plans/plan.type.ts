/* * */

import { createOperationalDate } from '@/types/common';
import { z } from 'zod';

/* * */

export const PlanSchema = z.object({
	_id: z.string(),
	agency_id: z.string(),
	created_at: z.date(),
	is_locked: z.boolean(),
	operation_file: z.string().nullable(),
	parsed_dates: z.array(z.string().transform(createOperationalDate).brand('OperationalDate')),
	reference_file: z.string().nullable(),
	status: z.string(),
	updated_at: z.date(),
	valid_from: z.string().transform(createOperationalDate).brand('OperationalDate'),
	valid_until: z.string().transform(createOperationalDate).brand('OperationalDate'),
}).strict();

export const CreatePlanSchema = PlanSchema;
export const UpdatePlanSchema = PlanSchema.partial();

/* * */

export type Plan = z.infer<typeof PlanSchema>;

export type CreatePlanDto = Plan;

export type UpdatePlanDto = Partial<Plan>;

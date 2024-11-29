/* * */

import { createOperationalDate, DocumentSchema, OperationalDate } from '@/types/common';
import { z } from 'zod';

/* * */

export const PlanSchema = DocumentSchema.extend({
	agency_id: z.string(),
	feeder_status: z.enum(['waiting', 'processing', 'success', 'error']),
	is_approved: z.boolean(),
	is_locked: z.boolean(),
	operation_file: z.string().nullable(),
	reference_file: z.string().nullable(),
	valid_from: z.string().transform(createOperationalDate).brand('OperationalDate'),
	valid_until: z.string().transform(createOperationalDate).brand('OperationalDate'),
}).strict();

export const CreatePlanSchema = PlanSchema.omit({ _id: true, created_at: true, updated_at: true });

export const UpdatePlanSchema = CreatePlanSchema.partial();

/* * */

export interface Plan extends Omit<z.infer<typeof PlanSchema>, 'parsed_dates' | 'valid_from' | 'valid_until'> {
	parsed_dates: OperationalDate[]
	valid_from: OperationalDate
	valid_until: OperationalDate
}

export interface CreatePlanDto extends Omit<z.infer<typeof CreatePlanSchema>, 'parsed_dates' | 'valid_from' | 'valid_until'> {
	parsed_dates: OperationalDate[]
	valid_from: OperationalDate
	valid_until: OperationalDate
}

export type UpdatePlanDto = Partial<CreatePlanDto>;

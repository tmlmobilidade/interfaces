/* * */

import { createOperationalDate, DocumentSchema, OperationalDate } from '@/types/common';
import z from 'zod';

/* * */

export const AgencySchema = DocumentSchema.extend({
	code: z.string(),
	email: z.string().email(),
	fare_url: z.string().url(),
	is_locked: z.boolean(),
	lang: z.string(),
	name: z.string(),
	operation_start_date: z.string().transform(createOperationalDate).brand('OperationalDate'),
	phone: z.string(),
	price_per_km: z.number(),
	timezone: z.string(),
	total_vkm_per_year: z.number(),
	updated_at: z.date().optional(),
	url: z.string().url(),
}).strict();

export const CreateAgencySchema = AgencySchema.omit({ _id: true, created_at: true, updated_at: true });
export const UpdateAgencySchema = CreateAgencySchema.partial();

/* * */

export interface Agency extends Omit<z.infer<typeof AgencySchema>, 'operation_start_date'> {
	operation_start_date: OperationalDate
}
export interface CreateAgencyDto extends Omit<z.infer<typeof CreateAgencySchema>, 'operation_start_date'> {
	operation_start_date: OperationalDate
}
export type UpdateAgencyDto = Partial<CreateAgencyDto>;

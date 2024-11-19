import { createOperationalDate, OperationalDate } from '@/types/common';
import z from 'zod';

// Define the Agency schema using Zod
export const AgencySchema = z.object({
	code: z.string(),
	created_at: z.date().optional(),
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

export const CreateAgencySchema = AgencySchema;
export const UpdateAgencySchema = AgencySchema.partial();

// Define types based on the schema
export interface Agency extends Omit<z.infer<typeof AgencySchema>, 'operation_start_date'> {
	operation_start_date: OperationalDate
}
export type CreateAgencyDto = Agency;
export type UpdateAgencyDto = Partial<Agency>;

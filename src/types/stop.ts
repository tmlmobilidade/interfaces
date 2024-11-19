import { ObjectId } from 'mongodb';
import z from 'zod';

export const StopSchema = z.object({
	code: z.string(),
	created_at: z.date(),
	latitude: z.number(),
	locality: z.string(),
	longitude: z.number(),
	municipality: z.instanceof(ObjectId),
	municipality_code: z.string(),
	name: z.string(),
	operational_status: z.string(),
	short_name: z.string(),
	tts_name: z.string(),
	updated_at: z.date(),
	zones: z.array(z.instanceof(ObjectId)),
}).strict();

export type Stop = z.infer<typeof StopSchema>;
export type CreateStopDto = Stop;
export type UpdateStopDto = Partial<Stop>;

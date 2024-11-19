import { ObjectId } from 'mongodb';
import z from 'zod';

export const StopSchema = z.object({
	_id: z.instanceof(ObjectId).optional(),
	code: z.string(),
	created_at: z.date().optional(),
	latitude: z.number(),
	locality: z.string(),
	longitude: z.number(),
	municipality: z.instanceof(ObjectId),
	municipality_code: z.string(),
	name: z.string(),
	operational_status: z.string(),
	short_name: z.string(),
	tts_name: z.string(),
	updated_at: z.date().optional(),
	zones: z.array(z.instanceof(ObjectId)),
}).strict();

export const UpdateStopSchema = StopSchema.partial();

export type Stop = z.infer<typeof StopSchema>;
export type CreateStopDto = Stop;
export type UpdateStopDto = Partial<Stop>;

import z from 'zod';

export const StopSchema = z.object({
	_id: z.string(),
	code: z.string(),
	created_at: z.date(),
	latitude: z.number(),
	locality: z.string(),
	longitude: z.number(),
	municipality: z.string(),
	municipality_code: z.string(),
	name: z.string(),
	operational_status: z.string(),
	short_name: z.string(),
	tts_name: z.string(),
	updated_at: z.date(),
	zones: z.array(z.string()),
}).strict();

export const CreateStopSchema = StopSchema.omit({ _id: true, created_at: true, updated_at: true });
export const UpdateStopSchema = CreateStopSchema.partial();

export type Stop = z.infer<typeof StopSchema>;
export type CreateStopDto = z.infer<typeof CreateStopSchema>;
export type UpdateStopDto = Partial<CreateStopDto>;

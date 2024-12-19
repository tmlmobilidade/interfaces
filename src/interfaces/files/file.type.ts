import { DocumentSchema } from '@/types/common';
import z from 'zod';

export const FileSchema = DocumentSchema.extend({
	created_by: z.string(),
	key: z.string(),
	metadata: z.record(z.unknown()).optional(),
	name: z.string(),
	size: z.number(),
	type: z.string(),
	updated_by: z.string(),
	url: z.string().optional(),
}).strict();

export const CreateFileSchema = FileSchema.omit({ _id: true, created_at: true, updated_at: true });
export const UpdateFileSchema = FileSchema.omit({ _id: true, created_at: true, updated_at: true }).partial();

export type File = z.infer<typeof FileSchema>;
export type CreateFileDto = z.infer<typeof CreateFileSchema>;
export type UpdateFileDto = z.infer<typeof UpdateFileSchema>;

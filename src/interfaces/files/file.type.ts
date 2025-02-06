import { DocumentSchema } from '@/types/common';
import z from 'zod';

export const FileSchema = DocumentSchema.extend({
	created_by: z.string(),
	description: z.string().optional(),
	key: z.string().describe('final path of the file in the storage, can be the resource id or the file name'),
	metadata: z.record(z.unknown()).optional(),
	name: z.string(),
	scope: z.string(),
	size: z.number().describe('size in bytes'),
	type: z.string().describe('mime type'),
	updated_by: z.string(),
	url: z.string().optional(),
}).strict();

export const CreateFileSchema = FileSchema.omit({ _id: true, created_at: true, updated_at: true });
export const UpdateFileSchema = FileSchema.omit({ _id: true, created_at: true, created_by: true, updated_at: true }).partial();

export type File = z.infer<typeof FileSchema>;
export type CreateFileDto = z.infer<typeof CreateFileSchema>;
export type UpdateFileDto = z.infer<typeof UpdateFileSchema>;

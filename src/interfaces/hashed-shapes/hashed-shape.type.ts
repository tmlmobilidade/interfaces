/* * */

import { DocumentSchema } from '@/types';
import { z } from 'zod';

/* * */

export const HashedShapePointSchema = z.object({
	shape_pt_lat: z.string(),
	shape_pt_lon: z.string(),
	shape_pt_sequence: z.number(),
}).strict();

export const CreateHashedShapePointSchema = HashedShapePointSchema;
export const UpdateHashedShapePointSchema = CreateHashedShapePointSchema.partial();

export type HashedShapePoint = z.infer<typeof HashedShapePointSchema>;
export type CreateHashedShapePointDto = HashedShapePoint;
export type UpdateHashedShapePointDto = Partial<HashedShapePoint>;

/* * */

export const HashedShapeSchema = DocumentSchema.extend({
	agency_id: z.string(),
	code: z.string(),
	points: z.array(HashedShapePointSchema),
	shape_id: z.string(),
}).strict();

export const CreateHashedShapeSchema = HashedShapeSchema.omit({ _id: true, created_at: true, updated_at: true });
export const UpdateHashedShapeSchema = CreateHashedShapeSchema.partial();

export type HashedShape = z.infer<typeof HashedShapeSchema>;
export type CreateHashedShapeDto = z.infer<typeof CreateHashedShapeSchema>;
export type UpdateHashedShapeDto = Partial<CreateHashedShapeDto>;

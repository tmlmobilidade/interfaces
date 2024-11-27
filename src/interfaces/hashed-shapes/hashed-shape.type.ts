/* * */

import { DocumentSchema } from '@/types/common';
import { z } from 'zod';

/* * */

export const HashedShapePointSchema = z.object({
	shape_dist_traveled: z.number(),
	shape_pt_lat: z.string(),
	shape_pt_lon: z.string(),
	shape_pt_sequence: z.number(),
}).strict();

export const CreateHashedShapePointSchema = HashedShapePointSchema;
export const UpdateHashedShapePointSchema = CreateHashedShapePointSchema.partial();

export type HashedShapePoint = z.infer<typeof HashedShapePointSchema>;
export type CreateHashedShapePointDto = z.infer<typeof CreateHashedShapePointSchema>;
export type UpdateHashedShapePointDto = Partial<CreateHashedShapePointDto>;

/* * */

export const HashedShapeSchema = DocumentSchema.extend({
	agency_id: z.string(),
	points: z.array(HashedShapePointSchema),
}).strict();

export const CreateHashedShapeSchema = HashedShapeSchema.omit({ created_at: true, updated_at: true });
export const UpdateHashedShapeSchema = CreateHashedShapeSchema.partial();

export type HashedShape = z.infer<typeof HashedShapeSchema>;
export type CreateHashedShapeDto = z.infer<typeof CreateHashedShapeSchema>;
export type UpdateHashedShapeDto = Partial<CreateHashedShapeDto>;

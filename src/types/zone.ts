import type { GeoJSON } from 'geojson';

import z from 'zod';

export const ZoneSchema = z.object({
	border_color: z.string(),
	border_opacity: z.number(),
	border_width: z.number(),
	code: z.string(),
	created_at: z.date(),
	fill_color: z.string(),
	fill_opacity: z.number(),
	geojson: z.record(z.any()), // TODO: Validate GeoJSON
	is_locked: z.boolean(),
	name: z.string(),
	updated_at: z.date(),
}).strict();

export type Zone = { geojson: GeoJSON } & Omit<z.infer<typeof ZoneSchema>, 'geojson'>;
export type CreateZoneDto = Zone;
export type UpdateZoneDto = Partial<Zone>;

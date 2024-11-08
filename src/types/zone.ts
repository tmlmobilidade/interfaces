import type { GeoJSON } from 'geojson';

export interface Zone {
	border_color: string
	border_opacity: number
	border_width: number
	code: string
	created_at: Date
	fill_color: string
	fill_opacity: number
	geojson: GeoJSON
	is_locked: boolean
	name: string
	updated_at: Date
}

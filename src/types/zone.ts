import type { GeoJSON } from 'geojson';

export interface Zone {
	border_color: string
	border_opacity: number
	border_width: number
	code: string
	createdAt: Date
	fill_color: string
	fill_opacity: number
	geojson: GeoJSON
	is_locked: boolean
	name: string
	updatedAt: Date
}

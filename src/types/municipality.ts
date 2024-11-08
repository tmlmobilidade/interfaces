import { GeoJSON } from 'geojson';

export interface Municipality {
	border_color: string
	border_opacity: number
	border_width: number
	code: string
	created_at: Date
	district: string
	fill_color: string
	fill_opacity: number
	geojson: GeoJSON
	is_locked: boolean
	name: string
	prefix: string
	region: string
	updated_at: Date
}

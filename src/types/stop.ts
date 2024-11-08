import { ObjectId } from 'mongodb';

export interface Stop {
	code: string
	created_at: Date
	latitude: number
	locality: string
	longitude: number
	municipality: ObjectId
	municipality_code: string
	name: string
	operational_status: string
	short_name: string
	tts_name: string
	updated_at: Date
	zones: ObjectId[]
}

import { ObjectId } from 'mongodb';

export interface Stop {
	code: string
	createdAt: Date
	latitude: number
	locality: string
	longitude: number
	municipality: ObjectId
	name: string
	operational_status: string
	short_name: string
	tts_name: string
	updatedAt: Date
	zones: ObjectId[]
}

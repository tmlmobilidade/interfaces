import { ObjectId } from 'mongodb';

import { OperationalDate } from './common';

export enum Cause {
	UNKNOWN_CAUSE,
	OTHER_CAUSE,
	TECHNICAL_PROBLEM,
	STRIKE,
	DEMONSTRATION,
	ACCIDENT,
	HOLIDAY,
	WEATHER,
	MAINTENANCE,
	CONSTRUCTION,
	POLICE_ACTIVITY,
	MEDICAL_EMERGENCY,
}

export enum Effect {
	NO_SERVICE,
	REDUCED_SERVICE,
	SIGNIFICANT_DELAYS,
	DETOUR,
	ADDITIONAL_SERVICE,
	MODIFIED_SERVICE,
	OTHER_EFFECT,
	UNKNOWN_EFFECT,
	STOP_MOVED,
}

export enum PublishStatus {
	PUBLISHED,
	EXPIRED,
	ARCHIVED,
	UNPUBLISHED,
}

export interface Alert {
	_id?: ObjectId
	active_period_end_date: OperationalDate
	active_period_start_date: OperationalDate
	agency_ids: string[]
	cause: Cause
	created_at?: Date
	description: string
	effect: Effect
	image_url: string
	line_ids: string[]
	municipality_ids: string[]
	publish_end_date: OperationalDate
	publish_start_date: OperationalDate
	publish_status: PublishStatus
	route_ids: string[]
	stop_ids: string[]
	title: string
	updated_at?: Date
}

export type UpdateAlertDto = Partial<Alert>;

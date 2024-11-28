import { createOperationalDate, DocumentSchema, OperationalDate } from '@/types/common';
import z from 'zod';

// Define constants for enum values for better maintainability
const CAUSE_VALUES = [
	'ACCIDENT',
	'CONSTRUCTION',
	'DEMONSTRATION',
	'HOLIDAY',
	'MAINTENANCE',
	'MEDICAL_EMERGENCY',
	'OTHER_CAUSE',
	'POLICE_ACTIVITY',
	'STRIKE',
	'TECHNICAL_PROBLEM',
	'UNKNOWN_CAUSE',
	'WEATHER',
] as const;

const EFFECT_VALUES = [
	'ACCESSIBILITY_ISSUE',
	'ADDITIONAL_SERVICE',
	'DETOUR',
	'MODIFIED_SERVICE',
	'NO_EFFECT',
	'NO_SERVICE',
	'OTHER_EFFECT',
	'REDUCED_SERVICE',
	'SIGNIFICANT_DELAYS',
	'STOP_MOVED',
	'UNKNOWN_EFFECT',
] as const;

const PUBLISH_STATUS_VALUES = [
	'PUBLISHED',
	'EXPIRED',
	'ARCHIVED',
	'UNPUBLISHED',
] as const;

// Define schemas using constants
export const causeSchema = z.enum(CAUSE_VALUES);
export const effectSchema = z.enum(EFFECT_VALUES);
export const publishStatusSchema = z.enum(PUBLISH_STATUS_VALUES);

// Define the Alert schema
export const AlertSchema = DocumentSchema.extend({
	active_period_end_date: z.string().transform(createOperationalDate).brand('OperationalDate'),
	active_period_start_date: z.string().transform(createOperationalDate).brand('OperationalDate'),
	agency_ids: z.array(z.string()),
	cause: causeSchema,
	description: z.string(),
	effect: effectSchema,
	image_url: z.string(),
	line_ids: z.array(z.string()),
	municipality_ids: z.array(z.string()),
	publish_end_date: z.date(),
	publish_start_date: z.date(),
	publish_status: publishStatusSchema,
	route_ids: z.array(z.string()),
	stop_ids: z.array(z.string()),
	title: z.string(),
	updated_at: z.date().optional(),
}).strict();

export const CreateAlertSchema = AlertSchema.omit({ _id: true, created_at: true, updated_at: true });
export const UpdateAlertSchema = CreateAlertSchema.partial();

// Define types based on schemas
export type Cause = z.infer<typeof causeSchema>;
export type Effect = z.infer<typeof effectSchema>;
export type PublishStatus = z.infer<typeof publishStatusSchema>;

// Define the Alert interface
export interface Alert
	extends Omit<
		z.infer<typeof AlertSchema>,
		'active_period_end_date'
		| 'active_period_start_date'
		| 'cause'
		| 'effect'
		// | 'publish_end_date'
		// | 'publish_start_date'
		| 'publish_status'
	> {
	active_period_end_date: OperationalDate
	active_period_start_date: OperationalDate
	cause: Cause
	effect: Effect
	// publish_end_date: OperationalDate
	// publish_start_date: OperationalDate
	publish_status: PublishStatus
}

export interface CreateAlertDto
	extends Omit<
		z.infer<typeof CreateAlertSchema>,
		'active_period_end_date'
		| 'active_period_start_date'
		| 'cause'
		| 'effect'
		// | 'publish_end_date'
		// | 'publish_start_date'
		| 'publish_status'
	> {
	active_period_end_date: OperationalDate
	active_period_start_date: OperationalDate
	cause: Cause
	effect: Effect
	// publish_end_date: OperationalDate
	// publish_start_date: OperationalDate
	publish_status: PublishStatus
}

export type UpdateAlertDto = Partial<CreateAlertDto>;

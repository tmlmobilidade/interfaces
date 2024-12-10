import { DocumentSchema } from '@/types/common';
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
export const RouteReferenceSchema = z.object({
	id: z.string().optional(),
	route_id: z.string(),
	stop_ids: z.array(z.string()),
});

export const StopReferenceSchema = z.object({
	id: z.string().optional(),
	route_ids: z.array(z.string()),
	stop_id: z.string(),
});

export const AgencyReferenceSchema = z.object({
	agency_id: z.string(),
	id: z.string().optional(),
});

// Define discriminated union based on 'reference_type'
const ReferenceUnionSchema = z.discriminatedUnion('type', [
	z.object({
		references: z.array(RouteReferenceSchema),
		type: z.literal('route'),
	}),
	z.object({
		references: z.array(StopReferenceSchema),
		type: z.literal('stop'),
	}),
	z.object({
		references: z.array(AgencyReferenceSchema),
		type: z.literal('agency'),
	}),
]);

// Updated AlertSchema with discriminated union
export const AlertSchema = DocumentSchema.extend({
	active_period_end_date: z.date(),
	active_period_start_date: z.date(),
	cause: causeSchema,
	description: z.string(),
	effect: effectSchema,
	image_url: z.string(),
	municipality_ids: z.array(z.string()),
	publish_end_date: z.date(),
	publish_start_date: z.date(),
	publish_status: publishStatusSchema,
	reference: ReferenceUnionSchema,
	title: z.string(),
	updated_at: z.date().optional(),
}).strict();

export const AlertReferenceOptions = ReferenceUnionSchema.options.map(option => option.shape.type.value);
export type AlertReferenceType = (typeof AlertReferenceOptions)[number];

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
		'cause'
		| 'effect'
		| 'publish_status'
	> {
	cause: Cause
	effect: Effect
	publish_status: PublishStatus
}

export interface CreateAlertDto
	extends Omit<
		z.infer<typeof CreateAlertSchema>,
		'cause'
		| 'effect'
		| 'publish_status'
	> {
	cause: Cause
	effect: Effect
	publish_status: PublishStatus
}

export type UpdateAlertDto = Partial<CreateAlertDto>;

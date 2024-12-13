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

// Base schema for alerts with common validation rules
const BaseAlertSchema = DocumentSchema.extend({
	active_period_end_date: z.coerce.date(),
	active_period_start_date: z.coerce.date(),
	cause: causeSchema,
	description: z.string(),
	effect: effectSchema,
	image_url: z.string().url().optional(),
	municipality_ids: z.array(z.string().min(1)),
	publish_end_date: z.coerce.date(),
	publish_start_date: z.coerce.date(),
	publish_status: publishStatusSchema,
	reference_type: z.enum(['route', 'stop', 'agency']),
	references: z.array(z.object({
		child_ids: z.array(z.string().min(1)),
		parent_id: z.string().min(1),
	})).min(1),
	title: z.string().min(1),
}).strict();

// Refinements
const partialBaseAlertSchema = BaseAlertSchema.partial();

const refinements = (data: z.infer<typeof partialBaseAlertSchema>, ctx: z.RefinementCtx) => {
	if (data.publish_status === 'PUBLISHED' && data.description && data.description.length < 1) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'Description is required when publish_status is \'PUBLISHED\'.',
		});
	}

	// Active period start date must be before or equal to end date
	if (data.active_period_start_date && data.active_period_end_date) {
		if (data.active_period_start_date > data.active_period_end_date) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Active period start date must be before or equal to end date',
			});
		}
	}

	// Publish start date must be before or equal to end date
	if (data.publish_start_date && data.publish_end_date) {
		if (data.publish_start_date > data.publish_end_date) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Publish start date must be before or equal to end date',
			});
		}
	}
};

// Export Schemas
export const AlertSchema = BaseAlertSchema.superRefine(refinements);

export const CreateAlertSchema = BaseAlertSchema
	.omit({ _id: true, created_at: true, updated_at: true })
	.superRefine(refinements);

export const UpdateAlertSchema = BaseAlertSchema
	.omit({ _id: true, created_at: true, updated_at: true })
	.partial()
	.superRefine(refinements);

// Define types based on schemas
export type Cause = z.infer<typeof causeSchema>;
export type Effect = z.infer<typeof effectSchema>;
export type PublishStatus = z.infer<typeof publishStatusSchema>;

// Define the Alert interface
export interface Alert
	extends Omit<
		z.infer<typeof BaseAlertSchema>,
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

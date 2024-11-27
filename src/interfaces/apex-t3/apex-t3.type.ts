/* * */

import { createOperationalDate, DocumentSchema, OperationalDate } from '@/types/common';
import { z } from 'zod';

/* * */

export const ApexT3Schema = DocumentSchema.extend({
	agency_id: z.string(),
	apex_version: z.string(),
	card_serial_number: z.string(),
	data: z.string(),
	device_id: z.string(),
	extra_trip_id: z.string(),
	line_id: z.string(),
	operational_day: z.string().transform(createOperationalDate).brand('OperationalDate'),
	pattern_id: z.string(),
	pcgi_id: z.string(),
	product_id: z.string(),
	route_id: z.string(),
	sam_serial_number: z.number(),
	stop_id: z.string(),
	timestamp: z.number(),
	trip_id: z.string(),
	vehicle_id: z.string(),
}).strict();

export const CreateApexT3Schema = ApexT3Schema.omit({ _id: true, created_at: true, updated_at: true });
export const UpdateApexT3Schema = CreateApexT3Schema.partial();

/**
 * APEX T3 are APEX trasactions of type 3 that are generated when a ticket is sold
 * in a vehicle, store or mobile app, and immediately loaded onto a transit card.
 * As such, these transactions represent sales of loadable products, such as tickets or passes.
 */
export interface ApexT3 extends Omit<z.infer<typeof ApexT3Schema>, 'operational_day'> {
	operational_day: OperationalDate
}

export interface CreateApexT3Dto extends Omit<z.infer<typeof CreateApexT3Schema>, 'operational_day'> {
	operational_day: OperationalDate
}

export type UpdateApexT3Dto = Partial<CreateApexT3Dto>;

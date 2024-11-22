/* * */

import { createOperationalDate } from '@/types/common';
import { z } from 'zod';

/* * */

export const ApexT3Schema = z.object({
	_id: z.string(),
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

export const CreateApexT3Schema = ApexT3Schema;
export const UpdateApexT3Schema = ApexT3Schema.partial();

/**
 * APEX T3 are APEX trasactions of type 3 that are generated when a ticket is sold
 * in a vehicle, store or mobile app, and immediately loaded onto a transit card.
 * As such, these transactions represent sales of loadable products, such as tickets or passes.
 */
export type ApexT3 = z.infer<typeof ApexT3Schema>;

export type CreateApexT3Dto = ApexT3;

export type UpdateApexT3Dto = Partial<ApexT3>;

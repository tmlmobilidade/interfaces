/* * */

import { createOperationalDate, DocumentSchema } from '@/types/common';
import { z } from 'zod';

/* * */

export const ApexT19Schema = DocumentSchema.extend({
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

export const CreateApexT19Schema = ApexT19Schema.omit({ _id: true, created_at: true, updated_at: true });
export const UpdateApexT19Schema = CreateApexT19Schema.partial();

/**
 * APEX T19 are APEX trasactions of type 19 that are generated everytime the
 * setContext or setT19 functions are called. These functions are used to set
 * the service context of the vehicle, allowing for the correct validation of products.
 * In summary, these transactions are generated everytime the vehicle has a change in
 * the current stop ID, route ID, pattern ID, etc.
 */
export type ApexT19 = z.infer<typeof ApexT19Schema>;

export type CreateApexT19Dto = ApexT19;

export type UpdateApexT19Dto = Partial<ApexT19>;

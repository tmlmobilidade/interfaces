/* * */

import { createOperationalDate, DocumentSchema } from '@/types/common';
import { z } from 'zod';

/* * */

export const ApexT19Schema = DocumentSchema.extend({
	_raw: z.string(),
	agency_id: z.string(),
	apex_version: z.string(),
	card_serial_number: z.string(),
	device_id: z.string(),
	extra_trip_id: z.string(),
	line_id: z.string(),
	operational_date: z.string().transform(createOperationalDate).brand('OperationalDate'),
	pattern_id: z.string(),
	product_id: z.string(),
	route_id: z.string(),
	sam_serial_number: z.number(),
	stop_id: z.string(),
	timestamp: z.date(),
	trip_id: z.string(),
	vehicle_id: z.string(),
}).strict();

/**
 * APEX T19 are APEX trasactions of type 19 that are generated everytime the
 * setContext or setT19 functions are called. These functions are used to set
 * the service context of the vehicle, allowing for the correct validation of products.
 * In summary, these transactions are generated everytime the vehicle has a change in
 * the current stop ID, route ID, pattern ID, etc.
 */
export type ApexT19 = z.infer<typeof ApexT19Schema>;

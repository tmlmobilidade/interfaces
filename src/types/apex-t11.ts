/* * */

import { createOperationalDate } from '@/types/common';
import { z } from 'zod';

/* * */

export const ApexT11Schema = z.object({
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

export const CreateApexT11Schema = ApexT11Schema;
export const UpdateApexT11Schema = ApexT11Schema.partial();

/**
 * APEX T11 are APEX trasactions of type 11 that are generated when a card holder touches a validator
 * reader (ex: bus validator, subway gate). These validation transactions represent the card holder's right to travel
 * on a given route, line, or vehicle. T11s have statuses that indicate if the card holder was allowed to travel
 * or not, and with which conditions. A validation also contains information about the card holder's card, the vehicle,
 * the validator machine, the route, and the time and location of the validation.
 */
export type ApexT11 = z.infer<typeof ApexT11Schema>;

export type CreateApexT11Dto = ApexT11;

export type UpdateApexT11Dto = Partial<ApexT11>;

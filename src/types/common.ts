/* * */

import { DateTime } from 'luxon';
import z from 'zod';

/* * */

export type Email = {
	__brand: 'Email'
} & string;

export function createEmail(email: string): Email {
	const parsedEmail = email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
	if (!parsedEmail) throw new Error(`Invalid email format '${email}'`);
	return email as Email;
}

/* * */

export const OPERATIONAL_DATE_FORMAT = 'yyyyMMdd';

export type OperationalDate = {
	__brand: 'OperationalDate'
} & string;

export function createOperationalDate(date: string): OperationalDate {
	const parsedDate = DateTime.fromFormat(date, OPERATIONAL_DATE_FORMAT);
	if (!parsedDate.isValid) throw new Error(`Invalid date format '${date}', expected format: ${OPERATIONAL_DATE_FORMAT}`);
	return parsedDate.toFormat(OPERATIONAL_DATE_FORMAT) as OperationalDate;
}

/* * */

export const DocumentSchema = z.object({
	_id: z.string(),
	created_at: z.date(),
	updated_at: z.date(),
});

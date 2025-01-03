/* * */

import type { DeleteResult as MongoDeleteResult, InsertOneResult as MongoInsertOneResult, UpdateResult as MongoUpdateResult } from 'mongodb';

import { DateTime } from 'luxon';
import z from 'zod';

/* * */

export type Email = string & {
	__brand: 'Email'
};

export function createEmail(email: string): Email {
	const parsedEmail = email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
	if (!parsedEmail) throw new Error(`Invalid email format '${email}'`);
	return email as Email;
}

/* * */

export const OPERATIONAL_DATE_FORMAT = 'yyyyMMdd';

export type OperationalDate = string & {
	__brand: 'OperationalDate'
};

export function createOperationalDate(date: string): OperationalDate {
	const parsedDate = DateTime.fromFormat(date, OPERATIONAL_DATE_FORMAT);
	if (!parsedDate.isValid) throw new Error(`Invalid date format '${date}', expected format: ${OPERATIONAL_DATE_FORMAT}`);
	return parsedDate.toFormat(OPERATIONAL_DATE_FORMAT) as OperationalDate;
}

/* * */

export const DocumentSchema = z.object({
	_id: z.string(),
	created_at: z.coerce.date().optional(),
	updated_at: z.coerce.date().optional(),
});

/* * */

export const CommentSchema = DocumentSchema.extend({
	_id: z.string(),
	text: z.string(),
	user_id: z.string(),
}).strict();

/* * */

export type DeleteResult = MongoDeleteResult;
export type InsertOneResult<T> = MongoInsertOneResult<T>;
export type UpdateResult = MongoUpdateResult;

import { ObjectId } from 'mongodb';
import z from 'zod';

import { Email } from './common';

export const PermissionSchema = z.object({
	action: z.string(),
	resource: z.record(z.any()).optional(),
	scope: z.string(),
});

export const UserSchema = z.object({
	avatar: z.string().optional(),
	bio: z.string().optional(),
	created_at: z.date(),
	email: z.string().email(),
	email_verified: z.date().optional(),
	first_name: z.string(),
	last_name: z.string(),
	organization_ids: z.array(z.instanceof(ObjectId)),
	password_hash: z.string(),
	permissions: z.array(PermissionSchema),
	phone: z.string(),
	role_ids: z.array(z.instanceof(ObjectId)),
	session_ids: z.array(z.instanceof(ObjectId)),
	updated_at: z.date(),
	verification_token_ids: z.array(z.instanceof(ObjectId)),
}).strict();

export const CreateUserSchema = UserSchema;
export const UpdateUserSchema = UserSchema.partial();

export const LoginDtoSchema = z.object({
	email: z.string(),
	password: z.string(),
}).strict();

export const RoleSchema = z.object({
	name: z.string(),
	permissions: z.array(PermissionSchema),
	scope: z.string(),
}).strict();

export const VerificationTokenSchema = z.object({
	expires: z.date(),
	token: z.string(),
	user_id: z.instanceof(ObjectId),
}).strict();

export const SessionSchema = z.object({
	expires_at: z.date().optional(),
	token: z.string(),
	user_id: z.instanceof(ObjectId),
}).strict();

export type User = { email: Email } & Omit<z.infer<typeof UserSchema>, 'email'>;
export type CreateUserDto = User;
export type UpdateUserDto = Partial<User>;

export type LoginDto = { email: Email } & z.infer<typeof LoginDtoSchema>;
export type VerificationToken = z.infer<typeof VerificationTokenSchema>;
export type Session = z.infer<typeof SessionSchema>;

export interface Role {
	name: string
	permissions: Permission<unknown>[]
}

export interface Permission<T> {
	action: string
	resource?: Partial<Record<keyof T, T[keyof T][]>>
	scope: string
}

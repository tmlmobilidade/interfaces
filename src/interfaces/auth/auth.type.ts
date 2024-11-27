/* * */

import { DocumentSchema, Email } from '@/types/common';
import z from 'zod';

export const PermissionSchema = z.object({
	action: z.string(),
	resource: z.record(z.any()).optional(),
	scope: z.string(),
});

export interface Permission<T> {
	action: string
	resource?: Partial<Record<keyof T, T[keyof T][]>>
	scope: string
}

/* * */

export const UserSchema = DocumentSchema.extend({
	avatar: z.string().optional(),
	bio: z.string().optional(),
	email: z.string().email(),
	email_verified: z.date().optional(),
	first_name: z.string(),
	last_name: z.string(),
	organization_ids: z.array(z.string()).default([]),
	password_hash: z.string(),
	permissions: z.array(PermissionSchema),
	phone: z.string(),
	role_ids: z.array(z.string()).default([]),
	session_ids: z.array(z.string()).default([]),
	verification_token_ids: z.array(z.string()).default([]),
}).strict();

export const CreateUserSchema = UserSchema.omit({ _id: true, created_at: true, updated_at: true });
export const UpdateUserSchema = CreateUserSchema.partial();

export type User = { email: Email } & Omit<z.infer<typeof UserSchema>, 'email'>;
export type CreateUserDto = { email: Email } & z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = Partial<CreateUserDto>;

/* * */

export const LoginDtoSchema = z.object({
	email: z.string(),
	password: z.string(),
}).strict();

export type LoginDto = { email: Email } & z.infer<typeof LoginDtoSchema>;

/* * */

export const RoleSchema = DocumentSchema.extend({
	name: z.string(),
	permissions: z.array(PermissionSchema),
}).strict();

export const CreateRoleSchema = RoleSchema.omit({ _id: true, created_at: true, updated_at: true });
export const UpdateRoleSchema = CreateRoleSchema.partial();

export type Role = z.infer<typeof RoleSchema>;
export type CreateRoleDto = z.infer<typeof CreateRoleSchema>;
export type UpdateRoleDto = Partial<CreateRoleDto>;

/* * */

export const VerificationTokenSchema = DocumentSchema.extend({
	expires: z.date(),
	token: z.string(),
	user_id: z.string(),
}).strict();

export const CreateVerificationTokenSchema = VerificationTokenSchema.omit({ _id: true, created_at: true, updated_at: true });
export const UpdateVerificationTokenSchema = CreateVerificationTokenSchema.partial();

export type VerificationToken = z.infer<typeof VerificationTokenSchema>;
export type CreateVerificationTokenDto = z.infer<typeof CreateVerificationTokenSchema>;
export type UpdateVerificationTokenDto = Partial<CreateVerificationTokenDto>;

/* * */

export const SessionSchema = DocumentSchema.extend({
	expires_at: z.date().optional(),
	token: z.string(),
	user_id: z.string(),
}).strict();

export const CreateSessionSchema = SessionSchema.omit({ _id: true, created_at: true, updated_at: true });
export const UpdateSessionSchema = CreateSessionSchema.partial();

export type Session = z.infer<typeof SessionSchema>;
export type CreateSessionDto = z.infer<typeof CreateSessionSchema>;
export type UpdateSessionDto = Partial<CreateSessionDto>;

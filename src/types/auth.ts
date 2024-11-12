import { ObjectId } from 'mongodb';

export interface User {
	avatar?: string
	bio?: string
	created_at: Date
	email: string
	email_verified?: Date
	first_name: string
	last_name: string
	organization_ids: ObjectId[]
	password_hash: string
	permissions: Permission<unknown>[]
	phone: string
	role_ids: ObjectId[]
	session_ids: ObjectId[]
	updated_at: Date
	verification_token_ids: ObjectId[]
}

export interface Role {
	name: string
	permissions: Permission<unknown>[]
}

export interface Permission<T> {
	action: string
	resource?: Partial<Record<keyof T, T[keyof T][]>>
	scope: string
}

export interface VerificationToken {
	expires: Date
	token: string
	user_id: string
}

export interface Session {
	expires_at?: Date
	token: string
	user_id: ObjectId
}

export interface LoginDto {
	email: string
	password: string
}

export interface RegisterDto {
	email: string
	password: string
}

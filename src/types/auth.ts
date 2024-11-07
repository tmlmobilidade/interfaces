export interface User {
	created_at: Date
	email: string
	email_verified?: Date
	organization_ids: string[]
	password_hash: string
	permissions: Permission<unknown>[]
	phone: string
	profile?: UserProfile
	role_ids: string[]
	session_ids: string[]
	updated_at: Date
	verification_token_ids: string[]
}

export interface UserProfile {
	avatar?: string
	bio?: string
	created_at: Date
	first_name: string
	last_name: string
	updated_at: Date
	user_id: string
}

export interface Role {
	id: string
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
	user_id: string
}

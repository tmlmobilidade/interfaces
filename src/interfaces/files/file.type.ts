export interface File {
	bucket_path?: string
	created_at: Date
	created_by: string
	metadata?: Record<string, unknown>
	name: string
	size: number
	type: string
	updated_at: Date
	updated_by: string
}

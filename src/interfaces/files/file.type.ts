export interface File {
	bucket_path?: string
	metadata?: Record<string, unknown>
	name: string
	type: string
}

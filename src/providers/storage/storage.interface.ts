import { Readable } from 'stream';

export interface IStorageProvider {
	// Delete a file from the storage.
	deleteFile(key: string): Promise<void>

	// Delete multiple files from the storage.
	deleteFiles(keys: string[]): Promise<void>

	// Get a file from the storage.
	getFileUrl(key: string): Promise<string>

	// List files in the storage.
	listFiles(prefix?: string): Promise<string[]>

	// Upload a file to the storage.
	uploadFile(key: string, body: Buffer | Readable | string): Promise<void>
}

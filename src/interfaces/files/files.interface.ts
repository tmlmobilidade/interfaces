import { MongoCollectionClass } from '@/classes/mongo-collection.class';
import { AsyncSingletonProxy } from '@/lib/utils';
import { File } from '@/types';

class FilesClass extends MongoCollectionClass<File> {
	private static _instance: FilesClass;

	private constructor() {
		super();
	}

	public static async getInstance() {
		if (!FilesClass._instance) {
			const instance = new FilesClass();
			await instance.connect();
			FilesClass._instance = instance;
		}
		return FilesClass._instance;
	}

	protected getCollectionName() {
		return 'files';
	}

	protected getEnvName() {
		return 'TML_INTERFACES_FILES';
	}

	/**
	 * TODO: Implement methods for uploading, downloading, and deleting files from a storage Connector
	 * This could be a cloud storage Connector like AWS S3, Google Cloud Storage or a local file system.
	 * Optionaly, we could implment file processing (e.g. image resizing, compressing, etc.)
	 */

	// async upload(file: Blob, scope: string) {
	// 	const _id = new ObjectId();
	// 	const filePath = `MY_ORGANIZATION/files/${scope}/${_id.toString()}.${file.type}`;

	// 	const id = await this.mongoCollection.insertOne({
	// 		_id,
	// 		bucket_path: filePath,
	// 		name: file.name,
	// 		type: file.type,
	// 	});

	// 	// Synchronously upload the file to the storage Connector
	// 	await storage.upload(file, filePath); // URL

	// 	return id;
	// }
}

export const files = AsyncSingletonProxy(FilesClass);

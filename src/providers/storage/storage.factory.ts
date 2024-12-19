import { AwsStorageService, AwsStorageServiceConfiguration } from './aws-storage.service';
import { CloudflareStorageService, CloudflareStorageServiceConfiguration } from './cloudflare-storage.service';
import { IStorageService } from './storage.interface';

export type StorageConfiguration = {
	aws_config: AwsStorageServiceConfiguration
	type: 'aws'
} | {
	cloudflare_config: CloudflareStorageServiceConfiguration
	type: 'cloudflare'
};

export class StorageFactory {
	/**
     * Creates and returns an instance of a storage service based on the provided configuration.
     *
     * @param config - The storage configuration object.
     * @returns An instance of a class that implements IStorageService.
     */
	public static create(config: StorageConfiguration): IStorageService {
		switch (config.type) {
			case 'aws':
				return new AwsStorageService(config.aws_config);
			case 'cloudflare':
				return new CloudflareStorageService(config.cloudflare_config);
			default:
				throw new Error(`Invalid storage type`);
		}
	}
}

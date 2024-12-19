import { AwsStorageProvider, AwsStorageProviderConfiguration } from './aws-storage.provider';
import { CloudflareStorageProvider, CloudflareStorageProviderConfiguration } from './cloudflare-storage.provider';
import { IStorageProvider } from './storage.interface';

export type StorageConfiguration = {
	aws_config: AwsStorageProviderConfiguration
	type: 'aws'
} | {
	cloudflare_config: CloudflareStorageProviderConfiguration
	type: 'cloudflare'
};

export class StorageFactory {
	/**
     * Creates and returns an instance of a storage service based on the provided configuration.
     *
     * @param config - The storage configuration object.
     * @returns An instance of a class that implements IStorageProvider.
     */
	public static create(config: StorageConfiguration): IStorageProvider {
		switch (config.type) {
			case 'aws':
				return new AwsStorageProvider(config.aws_config);
			case 'cloudflare':
				return new CloudflareStorageProvider(config.cloudflare_config);
			default:
				throw new Error(`Invalid storage type`);
		}
	}
}

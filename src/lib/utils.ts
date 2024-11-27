import { v4 as uuid } from 'uuid';

/**
 * Creates a proxy for a singleton class that delays method access until the instance is initialized.
 *
 * @param cls - A class with a static `getInstance` method that returns a promise resolving to the class instance.
 * @returns A proxy object that intercepts method calls and ensures the instance is initialized before invoking them.
 */
export function AsyncSingletonProxy<T extends object>(cls: { getInstance: () => Promise<T> }): T {
	return new Proxy({} as T, {
		get: function (_target, prop, receiver) {
			return async (...args: unknown[]) => {
				const instance = await cls.getInstance();
				const targetProp = Reflect.get(instance, prop, receiver);
				if (typeof targetProp === 'function') {
					return targetProp.apply(instance, args);
				}
				return targetProp;
			};
		},
	});
}

export function generateRandomToken() {
	return Buffer.from(uuid()).toString('base64');
}

/**
 * Creates a random string of a given length and type.
 *
 * @param length - The length of the string to generate.
 * @param type - The type of characters to include in the string.
 * @returns A random string of the specified length.
 */
interface GenerateRandomStringOptions {
	length?: number
	type?: 'alphanumeric' | 'numeric'
}

export function generateRandomString({ length = 6, type = 'alphanumeric' }: GenerateRandomStringOptions = {}): string {
	//

	const numericSet = '0123456789';
	const alphanumericSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

	let allowedCharacters: string;

	switch (type) {
		case 'numeric':
			allowedCharacters = numericSet;
			break;
		default:
			allowedCharacters = alphanumericSet;
			break;
	}

	let result = '';

	for (let i = 0; i < length; i++) {
		result += allowedCharacters.charAt(Math.floor(Math.random() * allowedCharacters.length));
	}

	return result;

	//
}

import z from 'zod';

/**
 * Convert an object to match a Zod schema's shape.
 *
 * @param source - The source object to convert
 * @param template - The Zod schema to validate against
 * @returns The converted object containing only the fields defined in the schema
 * @throws {Error} If a required field is missing from the source object
 */
export function convertObject<T extends z.ZodObject<z.ZodRawShape>>(
	source: Record<string, unknown>,
	template: T,
): z.infer<T> {
	const templateKeys = Object.keys(template.shape);
	const result: Record<string, unknown> = {};

	for (const key of templateKeys) {
		const fieldSchema = template.shape[key];
		const value = source[key];

		// Handle undefined/null values
		if (value === undefined || value === null) {
			if (!fieldSchema.isOptional()) {
				throw new Error(`Required field "${key}" is missing in the source object`);
			}
			continue;
		}

		if (!fieldSchema.safeParse(value).success) {
			throw new Error(`Invalid field type for "${key}" in the source object`);
		}

		// Add the value to result
		result[key] = value;
	}

	return result as z.infer<T>;
}

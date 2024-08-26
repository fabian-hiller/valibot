import type { JSONSchema7 } from 'json-schema';
import type { GenericSchema } from 'valibot';
import { convertSchema } from './schema-converters/index.ts';
import type { ConversionOptions } from './types.ts';

/** JSON Schema URI */
export const $schema = 'http://json-schema.org/draft-07/schema#';

/**
 * Convert valibot schema as JSON schema
 *
 * @param schema a valibot schema
 * @param options conversion options
 *
 * @returns the converted JSON schema
 */
export function toJsonSchema(
  schema: GenericSchema,
  options?: ConversionOptions
): JSONSchema7 {
  const converted = convertSchema(schema, options);
  return { $schema, ...converted };
}

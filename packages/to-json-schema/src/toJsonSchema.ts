import type { JSONSchema7 } from 'json-schema';
import type * as v from 'valibot';
import { convertSchema } from './convertSchema.ts';
import type { JsonSchemaConfig } from './type.ts';

/**
 * Converts a Valibot schema to the JSON schema format.
 *
 * @param schema The Valibot schema object.
 * @param config The JSON schema configuration.
 *
 * @returns The converted JSON schema.
 */
export function toJsonSchema(
  schema: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
  config?: JsonSchemaConfig
): JSONSchema7 {
  return convertSchema(
    { $schema: 'http://json-schema.org/draft-07/schema#' },
    // @ts-expect-error
    schema,
    config
  );
}

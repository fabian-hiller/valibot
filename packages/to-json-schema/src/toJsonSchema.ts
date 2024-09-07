import type { JSONSchema7 } from 'json-schema';
import type * as v from 'valibot';
import { convertSchema } from './convertSchema.ts';
import type { ConversionConfig, ConversionContext } from './type.ts';

/**
 * Converts a Valibot schema to the JSON Schema format.
 *
 * @param schema The Valibot schema object.
 * @param config The JSON Schema configuration.
 *
 * @returns The converted JSON Schema.
 */
export function toJsonSchema(
  schema: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
  config?: ConversionConfig
): JSONSchema7 {
  // Initialize JSON Schema context
  const context: ConversionContext = {
    definitions: {},
    referenceMap: new Map(),
  };

  // Convert Valibot schema to JSON Schema
  const jsonSchema = convertSchema(
    { $schema: 'http://json-schema.org/draft-07/schema#' },
    // @ts-expect-error
    schema,
    config,
    context
  );

  // Add definitions to JSON Schema, if necessary
  if (context.referenceMap.size) {
    jsonSchema.$defs = context.definitions;
  }

  // Return converted JSON Schema
  return jsonSchema;
}

import type { JSONSchema7 } from 'json-schema';
import type {
  ErrorMessage,
  ObjectEntries,
  ObjectIssue,
  ObjectSchema,
} from 'valibot';
import type { SchemaConverter } from '../types.ts';

export type SupportedObjectSchema = ObjectSchema<
  ObjectEntries,
  ErrorMessage<ObjectIssue> | undefined
>;

/**
 * Convert `object` schema.
 *
 * @param objectSchema schema to convert
 * @param convert      conversion function used to convert nested properties
 *
 * @returns the converted schema
 */
export const object: SchemaConverter<SupportedObjectSchema> = (
  objectSchema,
  convert
) => {
  const { entries } = objectSchema;
  const properties: Required<JSONSchema7>['properties'] = {};
  const required: Required<JSONSchema7>['required'] = [];

  for (const [key, schema] of Object.entries(entries)) {
    // Convert nested property schema
    properties[key] = convert(schema);
    // Add property to the required list
    required.push(key);
  }

  return {
    type: 'object',
    properties,
    required,
    additionalProperties: false,
  };
};

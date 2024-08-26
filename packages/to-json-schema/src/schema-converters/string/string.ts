import type { ErrorMessage, StringIssue, StringSchema } from 'valibot';
import type { SchemaConverter } from '../types.ts';

export type SupportedStringSchema = StringSchema<
  ErrorMessage<StringIssue> | undefined
>;

/**
 * Convert `string` schema.
 *
 * @returns the converted schema
 */
export const string: SchemaConverter<SupportedStringSchema> = () => ({
  type: 'string',
});

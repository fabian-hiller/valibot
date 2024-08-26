import type { ErrorMessage, NullIssue, NullSchema } from 'valibot';
import type { SchemaConverter } from '../types.ts';

export type SupportedNullSchema = NullSchema<
  ErrorMessage<NullIssue> | undefined
>;

/**
 * Convert `null` schema.
 *
 * @returns the converted schema
 */
export const null_: SchemaConverter<SupportedNullSchema> = () => ({
  type: 'null',
});

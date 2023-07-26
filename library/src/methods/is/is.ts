import { BaseSchema, Output } from '../../types';
import { safeParse } from '../safeParse';

/**
 * Type guard for a given schema
 *
 * @param schema The scheme to be used
 *
 * @param input The input to be tested
 *
 * @returns A type predicate for the given schema
 */
export function is<TSchema extends BaseSchema>(
  schema: TSchema,
  input: unknown
): input is Output<TSchema> {
  return safeParse(schema, input).success;
}

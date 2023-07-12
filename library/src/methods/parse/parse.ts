import type { BaseSchema, Output } from '../../types';

/**
 * Parses unknown input based on a schema.
 *
 * @param schema The scheme to be used.
 * @param input The input to be parsed.
 *
 * @returns The parsed output.
 */
export function parse<TSchema extends BaseSchema>(
  schema: TSchema,
  input: unknown
): Output<TSchema> {
  return schema.parse(input);
}

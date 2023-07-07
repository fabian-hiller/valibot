import type { ValiError } from '../error';
import type { BaseSchema, Output } from '../types';

/**
 * Parses unknown input based on a schema.
 *
 * @param schema The scheme to be used.
 * @param input The input to be parsed.
 *
 * @returns The parsed output.
 */
export function safeParse<TSchema extends BaseSchema>(
  schema: TSchema,
  input: unknown
):
  | { success: true; data: Output<TSchema> }
  | { success: false; error: ValiError } {
  try {
    return {
      success: true,
      data: schema.parse(input),
    };
  } catch (error) {
    return {
      success: false,
      error: error as ValiError,
    };
  }
}

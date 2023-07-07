import type { ValiError } from '../error';
import type { BaseSchema, BaseSchemaAsync, Output } from '../types';

/**
 * Parses unknown input based on a schema.
 *
 * @param schema The scheme to be used.
 * @param input The input to be parsed.
 *
 * @returns The parsed output.
 */
export async function safeParseAsync<
  TSchema extends BaseSchema | BaseSchemaAsync
>(
  schema: TSchema,
  input: unknown
): Promise<
  | { success: true; data: Output<TSchema> }
  | { success: false; error: ValiError }
> {
  try {
    return {
      success: true,
      data: await schema.parse(input),
    };
  } catch (error) {
    return {
      success: false,
      error: error as ValiError,
    };
  }
}

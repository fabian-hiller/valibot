import { ValiError } from '../../error/index.ts';
import type { BaseSchema, BaseSchemaAsync, ParseInfo } from '../../types.ts';
import type { SafeParseResult } from './types.ts';

/**
 * Parses unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param input The input to be parsed.
 * @param info The optional parse info.
 *
 * @returns The parsed output.
 */
export async function safeParseAsync<
  TSchema extends BaseSchema | BaseSchemaAsync
>(
  schema: TSchema,
  input: unknown,
  info?: Pick<ParseInfo, 'abortEarly' | 'abortPipeEarly'>
): Promise<SafeParseResult<TSchema>> {
  const result = await schema._parse(input, info);
  return result.issues
    ? {
        success: false,
        error: new ValiError(result.issues),
        issues: result.issues,
      }
    : {
        success: true,
        data: result.output,
        output: result.output,
      };
}

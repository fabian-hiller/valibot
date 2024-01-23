import { ValiError } from '../../error/index.ts';
import type { BaseSchema, Output, ParseInfo } from '../../types/index.ts';

/**
 * Parses unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param input The input to be parsed.
 * @param info The optional parse info.
 *
 * @returns The parsed output.
 */
export function parse<TSchema extends BaseSchema, TInput>(
  schema: TSchema,
  input: TInput extends Promise<any> ? never : TInput,
  info?: Pick<ParseInfo, 'abortEarly' | 'abortPipeEarly' | 'skipPipe'>
): Output<TSchema> {
  const result = schema._parse(input, info);
  if (result.issues) {
    throw new ValiError(result.issues);
  }
  return result.output;
}

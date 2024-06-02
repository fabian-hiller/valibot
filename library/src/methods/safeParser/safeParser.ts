import type {
  BaseIssue,
  BaseSchema,
  Config,
  InferIssue,
} from '../../types/index.ts';
import { safeParse, type SafeParseResult } from '../safeParse/index.ts';

/**
 * Returns a function that parses an unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param config The parser configuration.
 *
 * @returns The parser function.
 */
export function safeParser<
  const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(
  schema: TSchema,
  config?: Omit<Config<InferIssue<TSchema>>, 'skipPipe'>
): (input: unknown) => SafeParseResult<TSchema> {
  return (input: unknown) => safeParse(schema, input, config);
}

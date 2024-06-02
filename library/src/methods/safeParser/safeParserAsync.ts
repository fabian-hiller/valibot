import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  Config,
  InferIssue,
} from '../../types/index.ts';
import { safeParseAsync, type SafeParseResult } from '../safeParse/index.ts';

/**
 * Returns a function that parses an unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param config The parser configuration.
 *
 * @returns The parser function.
 */
export function safeParserAsync<
  const TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(
  schema: TSchema,
  config?: Omit<Config<InferIssue<TSchema>>, 'skipPipe'>
): (input: unknown) => Promise<SafeParseResult<TSchema>> {
  return (input: unknown) => safeParseAsync(schema, input, config);
}

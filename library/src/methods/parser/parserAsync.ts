import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  Config,
  InferIssue,
  InferOutput,
} from '../../types/index.ts';
import { parseAsync } from '../parse/index.ts';

/**
 * Returns a function that parses an unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param config The parser configuration.
 *
 * @returns The parser function.
 */
export function parserAsync<
  const TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(
  schema: TSchema,
  config?: Omit<Config<InferIssue<TSchema>>, 'skipPipe'>
): (input: unknown) => Promise<InferOutput<TSchema>> {
  return (input: unknown) => parseAsync(schema, input, config);
}

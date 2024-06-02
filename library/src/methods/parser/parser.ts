import type {
  BaseIssue,
  BaseSchema,
  Config,
  InferIssue,
  InferOutput,
} from '../../types/index.ts';
import { parse } from '../parse/index.ts';

/**
 * Returns a function that parses an unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param config The parser configuration.
 *
 * @returns The parser function.
 */
export function parser<
  const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(
  schema: TSchema,
  config?: Omit<Config<InferIssue<TSchema>>, 'skipPipe'>
): (input: unknown) => InferOutput<TSchema> {
  return (input: unknown) => parse(schema, input, config);
}

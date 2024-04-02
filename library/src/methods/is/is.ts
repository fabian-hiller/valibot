import type { BaseIssue, BaseSchema, InferInput } from '../../types/index.ts';

/**
 * Checks if the input matches the scheme. By using a type predicate, this
 * function can be used as a type guard.
 *
 * @param schema The schema to be used.
 * @param input The input to be tested.
 *
 * @returns Whether the input matches the scheme.
 */
export function is<
  const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(schema: TSchema, input: unknown): input is InferInput<TSchema> {
  return !schema._run({ typed: false, value: input }, { abortEarly: true })
    .issues;
}

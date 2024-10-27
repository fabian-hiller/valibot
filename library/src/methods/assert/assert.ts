import type { BaseIssue, BaseSchema, InferInput } from '../../types/index.ts';
import { ValiError } from '../../utils/index.ts';

/**
 * Checks if the input matches the schema. As this is an assertion function, it
 * can be used as a type guard.
 *
 * @param schema The schema to be used.
 * @param input The input to be tested.
 */
export function assert<
  const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(schema: TSchema, input: unknown): asserts input is InferInput<TSchema> {
  const issues = schema['~validate'](
    { value: input },
    { abortEarly: true }
  ).issues;
  if (issues) {
    throw new ValiError(issues);
  }
}

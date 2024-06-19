import { expect } from 'vitest';
import type {
  BaseIssue,
  BaseSchema,
  InferIssue,
  UntypedDataset,
} from '../types/index.ts';
import { _stringify } from '../utils/index.ts';

/**
 * Expect an schema issue to be returned.
 *
 * @param schema The schema to test.
 * @param baseIssue The base issue data.
 * @param values The values to test.
 * @param received The received value.
 */
export function expectSchemaIssue<
  TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(
  schema: TSchema,
  baseIssue: Omit<InferIssue<TSchema>, 'input' | 'received'>,
  values: unknown[],
  received?: string
): void {
  for (const value of values) {
    expect(schema._run({ typed: false, value }, {})).toStrictEqual({
      typed: false,
      value,
      issues: [
        {
          requirement: undefined,
          path: undefined,
          issues: undefined,
          lang: undefined,
          abortEarly: undefined,
          abortPipeEarly: undefined,

          ...baseIssue,
          input: value,
          received: received ?? _stringify(value),
        },
      ],
    } satisfies UntypedDataset<InferIssue<TSchema>>);
  }
}

import { expect } from 'vitest';
import type {
  BaseIssue,
  BaseValidationAsync,
  InferInput,
  InferIssue,
  TypedDataset,
} from '../types/index.ts';
import { _stringify } from '../utils/index.ts';

/**
 * Expect an action issue to be returned.
 *
 * @param action The action to test.
 * @param baseIssue The base issue data.
 * @param values The values to test.
 * @param getReceived Received value getter.
 */
export async function expectActionIssueAsync<
  TAction extends BaseValidationAsync<unknown, unknown, BaseIssue<unknown>>,
>(
  action: TAction,
  baseIssue: Omit<InferIssue<TAction>, 'input' | 'received'>,
  values: InferInput<TAction>[],
  getReceived?: (value: InferInput<TAction>) => string
): Promise<void> {
  for (const value of values) {
    expect(await action._run({ typed: true, value }, {})).toStrictEqual({
      typed: true,
      value,
      issues: [
        {
          requirement: undefined,
          path: undefined,
          issues: undefined,
          lang: undefined,
          abortEarly: undefined,
          abortPipeEarly: undefined,

          input: value,
          received: getReceived?.(value) ?? _stringify(value),
          ...baseIssue,
        },
      ],
    } satisfies TypedDataset<typeof value, InferIssue<TAction>>);
  }
}

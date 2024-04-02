import { expect } from 'vitest';
import type {
  BaseIssue,
  BaseValidation,
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
 */
export function expectActionIssue<
  TAction extends BaseValidation<unknown, unknown, BaseIssue<unknown>>,
>(
  action: TAction,
  baseIssue: Omit<InferIssue<TAction>, 'input' | 'received'>,
  values: unknown[]
): void {
  for (const value of values) {
    expect(action._run({ typed: true, value }, {})).toStrictEqual({
      typed: true,
      value,
      issues: [
        {
          path: undefined,
          issues: undefined,
          lang: undefined,
          abortEarly: undefined,
          abortPipeEarly: undefined,
          skipPipe: undefined,
          ...baseIssue,
          input: value,
          received: _stringify(value),
        },
      ],
    } satisfies TypedDataset<typeof value, InferIssue<TAction>>);
  }
}

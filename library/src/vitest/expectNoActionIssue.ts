import { expect } from 'vitest';
import type { BaseIssue, BaseValidation, InferInput } from '../types/index.ts';

/**
 * Expect no action issue to be returned.
 *
 * @param action The action to test.
 * @param values The values to test.
 */
export function expectNoActionIssue<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TAction extends BaseValidation<any, unknown, BaseIssue<unknown>>,
>(action: TAction, values: InferInput<TAction>[]): void {
  for (const value of values) {
    expect(action['~validate']({ typed: true, value }, {})).toStrictEqual({
      typed: true,
      value,
    });
  }
}

import { describe, expect, test } from 'vitest';
import {
  expectActionIssueAsync,
  expectNoActionIssueAsync,
} from '../../vitest/index.ts';
import { type CheckActionAsync, checkAsync } from './checkAsync.ts';
import type { CheckIssue } from './types.ts';

describe('checkAsync', () => {
  describe('should return action object', () => {
    const requirement = async (input: string) => input.includes('foo');
    const baseAction: Omit<CheckActionAsync<string, never>, 'message'> = {
      kind: 'validation',
      type: 'check',
      reference: checkAsync,
      expects: null,
      requirement,
      async: true,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: CheckActionAsync<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(checkAsync<string>(requirement)).toStrictEqual(action);
      expect(
        checkAsync<string, undefined>(requirement, undefined)
      ).toStrictEqual(action);
    });

    test('with string message', () => {
      const message = 'message';
      expect(checkAsync<string, 'message'>(requirement, message)).toStrictEqual(
        {
          ...baseAction,
          message,
        } satisfies CheckActionAsync<string, 'message'>
      );
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(
        checkAsync<string, typeof message>(requirement, message)
      ).toStrictEqual({
        ...baseAction,
        message,
      } satisfies CheckActionAsync<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = checkAsync<number>(async (input) => input > 0);

    test('for untyped inputs', async () => {
      expect(
        await action._run({ typed: false, value: null }, {})
      ).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid inputs', async () => {
      await expectNoActionIssueAsync(action, [1, 12345, Infinity]);
    });
  });

  describe('should return dataset with issues', () => {
    const requirement = async (input: number) => input > 0;
    const action = checkAsync<number, 'message'>(requirement, 'message');

    const baseIssue: Omit<CheckIssue<number>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'check',
      expected: null,
      message: 'message',
      requirement,
    };

    test('for invalid inputs', async () => {
      await expectActionIssueAsync(action, baseIssue, [
        0,
        -1,
        -12345,
        -Infinity,
      ]);
    });
  });
});

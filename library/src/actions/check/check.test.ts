import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { check, type CheckAction, type CheckIssue } from './check.ts';

describe('check', () => {
  describe('should return action object', () => {
    const requirement = (element: string) => element.includes('foo');
    const baseAction: Omit<CheckAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'check',
      reference: check,
      expects: null,
      requirement,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: CheckAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(check<string>(requirement)).toStrictEqual(action);
      expect(check<string, undefined>(requirement, undefined)).toStrictEqual(
        action
      );
    });

    test('with string message', () => {
      const message = 'message';
      expect(check<string, 'message'>(requirement, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies CheckAction<string, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(check<string, typeof message>(requirement, message)).toStrictEqual(
        {
          ...baseAction,
          message,
        } satisfies CheckAction<string, typeof message>
      );
    });
  });

  describe('should return dataset without issues', () => {
    const action = check<number>((input) => input > 0);

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid content', () => {
      expectNoActionIssue(action, [1, Infinity]);
    });
  });

  describe('should return an issue', () => {
    const requirement = (input: number) => input > 0;
    const action = check<number, 'Value is not greater than 1'>(
      requirement,
      'Value is not greater than 1'
    );

    const baseIssue: Omit<CheckIssue<number>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'check',
      expected: null,
      message: 'Value is not greater than 1',
      requirement,
    };

    test('for invalid content', () => {
      expectActionIssue(action, baseIssue, [0, -1, -Infinity]);
    });
  });
});

import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { finite, type FiniteAction, type FiniteIssue } from './finite.ts';

describe('finite', () => {
  describe('should return action object', () => {
    const baseAction: Omit<FiniteAction<number, never>, 'message'> = {
      kind: 'validation',
      type: 'finite',
      reference: finite,
      expects: null,
      requirement: expect.any(Function),
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: FiniteAction<number, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(finite()).toStrictEqual(action);
      expect(finite(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(finite('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies FiniteAction<number, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(finite(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies FiniteAction<number, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = finite();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for finite numbers', () => {
      expectNoActionIssue(action, [
        0,
        1234,
        12.34,
        Number.MAX_VALUE,
        Number.MIN_VALUE,
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = finite('message');
    const baseIssue: Omit<FiniteIssue<number>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'finite',
      expected: null,
      message: 'message',
      requirement: expect.any(Function),
    };

    test('for infinite numbers', () => {
      expectActionIssue(action, baseIssue, [Infinity, -Infinity]);
    });

    test('for not a number', () => {
      expectActionIssue(action, baseIssue, [NaN]);
    });
  });
});

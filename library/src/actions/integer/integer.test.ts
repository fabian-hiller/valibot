import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { integer, type IntegerAction, type IntegerIssue } from './integer.ts';

describe('integer', () => {
  describe('should return action object', () => {
    const baseAction: Omit<IntegerAction<number, never>, 'message'> = {
      kind: 'validation',
      type: 'integer',
      expects: null,
      requirement: expect.any(Function),
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: IntegerAction<number, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(integer()).toStrictEqual(action);
      expect(integer(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(integer('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies IntegerAction<number, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(integer(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies IntegerAction<number, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = integer();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for integer numbers', () => {
      expectNoActionIssue(action, [
        0,
        123456789,
        -123456789,
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = integer('message');
    const baseIssue: Omit<IntegerIssue<number>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'integer',
      expected: null,
      message: 'message',
      requirement: expect.any(Function),
    };

    test('for floating point numbers', () => {
      expectActionIssue(action, baseIssue, [0.1, 12.34, -1 / 3, Math.PI]);
    });

    test('for infinite numbers', () => {
      expectActionIssue(action, baseIssue, [Infinity, -Infinity]);
    });

    test('for not a number', () => {
      expectActionIssue(action, baseIssue, [NaN]);
    });
  });
});

import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import {
  multipleOf,
  type MultipleOfAction,
  type MultipleOfIssue,
} from './multipleOf.ts';

describe('multipleOf', () => {
  describe('should return action object', () => {
    const baseAction: Omit<MultipleOfAction<number, 5, never>, 'message'> = {
      kind: 'validation',
      type: 'multiple_of',
      reference: multipleOf,
      expects: '%5',
      requirement: 5,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: MultipleOfAction<number, 5, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(multipleOf(5)).toStrictEqual(action);
      expect(multipleOf(5, undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(multipleOf(5, 'message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies MultipleOfAction<number, 5, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(multipleOf(5, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies MultipleOfAction<number, 5, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = multipleOf(5);

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid inputs', () => {
      expectNoActionIssue(action, [-15, -10, -5, 0, 5, 10, 15]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = multipleOf(5, 'message');
    const baseIssue: Omit<MultipleOfIssue<number, 5>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'multiple_of',
      expected: '%5',
      message: 'message',
      requirement: 5,
    };

    test('for invalid inputs', () => {
      expectActionIssue(
        action,
        baseIssue,
        [-Infinity, -14, -9, -4, 1, 3, 6, 11, Infinity, NaN],
        (value) => `${value}`
      );
    });
  });
});

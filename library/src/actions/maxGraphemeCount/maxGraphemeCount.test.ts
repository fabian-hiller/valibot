import { describe, expect, test } from 'vitest';
import { _getGraphemeCount } from '../../utils/index.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import {
  maxGraphemeCount,
  type MaxGraphemeCountAction,
  type MaxGraphemeCountIssue,
} from './maxGraphemeCount.ts';

describe('maxGraphemeCount', () => {
  describe('should return action object', () => {
    const baseAction: Omit<
      MaxGraphemeCountAction<string, 5, never>,
      'message'
    > = {
      kind: 'validation',
      type: 'max_grapheme_count',
      reference: maxGraphemeCount,
      expects: '<=5',
      requirement: 5,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: MaxGraphemeCountAction<string, 5, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(maxGraphemeCount(5)).toStrictEqual(action);
      expect(maxGraphemeCount(5, undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(maxGraphemeCount(5, 'message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies MaxGraphemeCountAction<string, 5, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(maxGraphemeCount(5, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies MaxGraphemeCountAction<string, 5, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = maxGraphemeCount(5);

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid strings', () => {
      expectNoActionIssue(action, ['🧑🏻‍💻', '😀😀😀😀', 'foo']);
    });
  });

  describe('should return dataset with issues', () => {
    const action = maxGraphemeCount(5, 'message');
    const baseIssue: Omit<
      MaxGraphemeCountIssue<string, 5>,
      'input' | 'received'
    > = {
      kind: 'validation',
      type: 'max_grapheme_count',
      expected: '<=5',
      message: 'message',
      requirement: 5,
    };

    test('for invalid strings', () => {
      expectActionIssue(
        action,
        baseIssue,
        ['😀😀😀😀😀😀', 'foobarbaz123'],
        (value) => `${_getGraphemeCount(value)}`
      );
    });
  });
});

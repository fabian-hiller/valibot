import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import {
  minGraphemeCount,
  type MinGraphemeCountAction,
  type MinGraphemeCountIssue,
} from './minGraphemeCount.ts';
import { _getGraphemeCount } from '../../utils/index.ts';

describe('minGraphemeCount', () => {
  describe('should return action object', () => {
    const baseAction: Omit<
      MinGraphemeCountAction<string, 5, never>,
      'message'
    > = {
      kind: 'validation',
      type: 'min_grapheme_count',
      reference: minGraphemeCount,
      expects: '>=5',
      requirement: 5,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: MinGraphemeCountAction<string, 5, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(minGraphemeCount(5)).toStrictEqual(action);
      expect(minGraphemeCount(5, undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(minGraphemeCount(5, 'message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies MinGraphemeCountAction<string, 5, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(minGraphemeCount(5, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies MinGraphemeCountAction<string, 5, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = minGraphemeCount(5);

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid strings', () => {
      expectNoActionIssue(action, ['😀😀😀😀😀', '123456', 'foobarbaz123']);
    });
  });

  describe('should return dataset with issues', () => {
    const action = minGraphemeCount(5, 'message');
    const baseIssue: Omit<
      MinGraphemeCountIssue<string, 5>,
      'input' | 'received'
    > = {
      kind: 'validation',
      type: 'min_grapheme_count',
      expected: '>=5',
      message: 'message',
      requirement: 5,
    };

    test('for invalid strings', () => {
      expectActionIssue(
        action,
        baseIssue,
        ['🧑🏻‍💻', '😀😀😀😀', 'foo'],
        (value) => `${_getGraphemeCount(value)}`
      );
    });
  });
});

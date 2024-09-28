import { describe, expect, test } from 'vitest';
import { _getGraphemes } from '../../utils/index.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import {
  maxGraphemes,
  type MaxGraphemesAction,
  type MaxGraphemesIssue,
} from './maxGraphemes.ts';

describe('maxGraphemes', () => {
  describe('should return action object', () => {
    const baseAction: Omit<
      MaxGraphemesAction<string, 5, never>,
      'message'
    > = {
      kind: 'validation',
      type: 'max_graphemes',
      reference: maxGraphemes,
      expects: '<=5',
      requirement: 5,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: MaxGraphemesAction<string, 5, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(maxGraphemes(5)).toStrictEqual(action);
      expect(maxGraphemes(5, undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(maxGraphemes(5, 'message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies MaxGraphemesAction<string, 5, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(maxGraphemes(5, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies MaxGraphemesAction<string, 5, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = maxGraphemes(5);

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
    const action = maxGraphemes(5, 'message');
    const baseIssue: Omit<
      MaxGraphemesIssue<string, 5>,
      'input' | 'received'
    > = {
      kind: 'validation',
      type: 'max_graphemes',
      expected: '<=5',
      message: 'message',
      requirement: 5,
    };

    test('for invalid strings', () => {
      expectActionIssue(
        action,
        baseIssue,
        ['😀😀😀😀😀😀', 'foobarbaz123'],
        (value) => `${_getGraphemes(value)}`
      );
    });
  });
});

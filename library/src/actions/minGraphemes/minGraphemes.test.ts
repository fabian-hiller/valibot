import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import {
  minGraphemes,
  type MinGraphemesAction,
  type MinGraphemesIssue,
} from './minGraphemes.ts';
import { _getGraphemes } from '../../utils/index.ts';

describe('minGraphemes', () => {
  describe('should return action object', () => {
    const baseAction: Omit<
      MinGraphemesAction<string, 5, never>,
      'message'
    > = {
      kind: 'validation',
      type: 'min_graphemes',
      reference: minGraphemes,
      expects: '>=5',
      requirement: 5,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: MinGraphemesAction<string, 5, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(minGraphemes(5)).toStrictEqual(action);
      expect(minGraphemes(5, undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(minGraphemes(5, 'message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies MinGraphemesAction<string, 5, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(minGraphemes(5, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies MinGraphemesAction<string, 5, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = minGraphemes(5);

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
    const action = minGraphemes(5, 'message');
    const baseIssue: Omit<
      MinGraphemesIssue<string, 5>,
      'input' | 'received'
    > = {
      kind: 'validation',
      type: 'min_graphemes',
      expected: '>=5',
      message: 'message',
      requirement: 5,
    };

    test('for invalid strings', () => {
      expectActionIssue(
        action,
        baseIssue,
        ['🧑🏻‍💻', '😀😀😀😀', 'foo'],
        (value) => `${_getGraphemes(value)}`
      );
    });
  });
});

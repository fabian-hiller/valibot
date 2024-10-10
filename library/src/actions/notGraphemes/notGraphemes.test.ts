import { describe, expect, test } from 'vitest';
import { _getGraphemes } from '../../utils/index.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import {
  notGraphemes,
  type NotGraphemesAction,
  type NotGraphemesIssue,
} from './notGraphemes.ts';

describe('notGraphemes', () => {
  describe('should return action object', () => {
    const baseAction: Omit<NotGraphemesAction<string, 5, never>, 'message'> = {
      kind: 'validation',
      type: 'not_graphemes',
      reference: notGraphemes,
      expects: '!5',
      requirement: 5,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: NotGraphemesAction<string, 5, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(notGraphemes(5)).toStrictEqual(action);
      expect(notGraphemes(5, undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(notGraphemes(5, 'message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies NotGraphemesAction<string, 5, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(notGraphemes(5, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies NotGraphemesAction<string, 5, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = notGraphemes(5);

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid strings', () => {
      expectNoActionIssue(action, [
        '😀😀😀😀',
        '1234',
        'foobar',
        '😀😀😀😀😀😀',
        '🧑‍💻',
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = notGraphemes(5, 'message');
    const baseIssue: Omit<
      NotGraphemesIssue<string, 5>,
      'input' | 'received'
    > = {
      kind: 'validation',
      type: 'not_graphemes',
      expected: '!5',
      message: 'message',
      requirement: 5,
    };

    test('for invalid strings', () => {
      expectActionIssue(
        action,
        baseIssue,
        ['😀😀😀😀😀', '12345', 'hello'],
        (value) => `${_getGraphemes(value)}`
      );
    });
  });
});

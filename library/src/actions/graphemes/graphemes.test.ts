import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { graphemes, type GraphemesAction, type GraphemesIssue } from './graphemes.ts';
import { _getGraphemes } from '../../utils/index.ts';

describe('graphemes', () => {
  describe('should return action object', () => {
    const baseAction: Omit<GraphemesAction<string, 5, never>, 'message'> = {
      kind: 'validation',
      type: 'graphemes',
      reference: graphemes,
      expects: '5',
      requirement: 5,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: GraphemesAction<string, 5, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(graphemes(5)).toStrictEqual(action);
      expect(graphemes(5, undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(graphemes(5, 'message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies GraphemesAction<string, 5, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(graphemes(5, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies GraphemesAction<string, 5, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = graphemes(5);

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid strings', () => {
      expectNoActionIssue(action, ['😀😀😀😀😀', '12345', 'hello']);
    });
  });

  describe('should return dataset with issues', () => {
    const action = graphemes(5, 'message');
    const baseIssue: Omit<GraphemesIssue<string, 5>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'graphemes',
      expected: '5',
      message: 'message',
      requirement: 5,
    };

    test('for invalid strings', () => {
      expectActionIssue(
        action,
        baseIssue,
        ['😀😀😀😀', '1234', 'foobar', '😀😀😀😀😀😀', '🧑‍💻'],
        (value) => `${_getGraphemes(value)}`
      );
    });
  });
});

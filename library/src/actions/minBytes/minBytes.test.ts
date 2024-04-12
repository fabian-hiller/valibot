import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import {
  minBytes,
  type MinBytesAction,
  type MinBytesIssue,
} from './minBytes.ts';

describe('minBytes', () => {
  describe('should return action object', () => {
    const baseAction: Omit<MinBytesAction<string, 5, never>, 'message'> = {
      kind: 'validation',
      type: 'min_bytes',
      expects: '>=5',
      requirement: 5,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: MinBytesAction<string, 5, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(minBytes(5)).toStrictEqual(action);
      expect(minBytes(5, undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(minBytes(5, 'message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies MinBytesAction<string, 5, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(minBytes(5, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies MinBytesAction<string, 5, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = minBytes(5);

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid strings', () => {
      expectNoActionIssue(action, ['12345', '123456', 'foobarbaz123']);
    });

    test('for UTF-8 characters', () => {
      const value3 = 'あい'; // in UTF-8, 'あい' is 6 bytes
      expectNoActionIssue(action, [value3]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = minBytes(5, 'message');
    const expectedValues: Record<string, number> = {
      '': 0,
      'not': 3,
      'four': 4,
      'あ': 3,
      'い': 3,
    };

    const baseIssue: Omit<MinBytesIssue<string, 5>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'min_bytes',
      expected: '>=5',
      message: 'message',
      requirement: 5,
    };

    test('for invalid strings', () => {
      expectActionIssue(
        action,
        baseIssue,
        ['', 'not', 'four'],
        (value) => `${expectedValues[value]}`
      );
    });

    test('for invalid UTF-8 characters', () => {
      expectActionIssue(
        action,
        baseIssue,
        ['あ', 'い'],
        (value) => `${expectedValues[value]}`
      );
    });

  });
});

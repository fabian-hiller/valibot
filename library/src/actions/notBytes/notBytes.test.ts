import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import {
  notBytes,
  type NotBytesAction,
  type NotBytesIssue,
} from './notBytes.ts';

describe('notBytes', () => {
  describe('should return action object', () => {
    const baseAction: Omit<NotBytesAction<string, 5, never>, 'message'> = {
      kind: 'validation',
      type: 'not_bytes',
      expects: '!5',
      requirement: 5,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: NotBytesAction<string, 5, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(notBytes(5)).toStrictEqual(action);
      expect(notBytes(5, undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(notBytes(5, 'message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies NotBytesAction<string, 5, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(notBytes(5, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies NotBytesAction<string, 5, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = notBytes(5);

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid strings', () => {
      expectNoActionIssue(
        action, 
        [
          '',
          '🤖', // in UTF-8, '🤖' is 4 bytes
          '1234',
          'hello!',
          'hi1234'
        ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = notBytes(5, 'message');
    const baseIssue: Omit<NotBytesIssue<string, 5>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'not_bytes',
      expected: '!5',
      message: 'message',
      requirement: 5,
    };

    test('for invalid strings', () => {
      expectActionIssue(
        action,
        baseIssue,
        ['12あ', '🤖!', 'hi123'], // Make sure all of the strings in this array have a byte length of 5
        () => '5'
      );
    });
  });
});

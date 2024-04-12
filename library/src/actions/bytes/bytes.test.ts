import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import {
  bytes,
  type BytesAction,
  type BytesIssue,
} from './bytes.ts';

describe('bytes', () => {
  describe('should return action object', () => {
    const baseAction: Omit<BytesAction<string, 5, never>, 'message'> = {
      kind: 'validation',
      type: 'bytes',
      expects: '5',
      requirement: 5,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: BytesAction<string, 5, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(bytes(5)).toStrictEqual(action);
      expect(bytes(5, undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(bytes(5, 'message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies BytesAction<string, 5, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(bytes(5, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies BytesAction<string, 5, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = bytes(5);

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
          '12あ', // in UTF-8, 'あ' is 3 bytes 
          'hi123', 
          '🤖!' // in UTF-8, '🤖' is 4 bytes
        ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = bytes(5, 'message');
    const baseIssue: Omit<BytesIssue<string, 5>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'bytes',
      expected: '5',
      message: 'message',
      requirement: 5,
    };

    test('for invalid strings', () => {
      const inputToBytesReceived = new Map([
        ['', 0],
        ['🤖', 4],
        ['1234', 4],
        ['hello!', 6],
        ['hi1234', 6]
      ]);

      expectActionIssue(
        action,
        baseIssue,
        [...inputToBytesReceived.keys()],
        // If the function below returns '-1', test setup is incorrect, fix it.
        (input) => `${inputToBytesReceived.get(input) ?? -1}`
      );
    });
  });
});

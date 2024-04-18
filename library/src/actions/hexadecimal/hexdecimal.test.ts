import { describe, expect, test } from 'vitest';
import { HEXADECIMAL_REGEX } from '../../regex.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import {
  hexadecimal,
  type HexadecimalAction,
  type HexadecimalIssue,
} from './hexadecimal.ts';

describe('hexadecimal', () => {
  describe('should return action object', () => {
    const baseAction: Omit<HexadecimalAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'hexadecimal',
      expects: null,
      requirement: HEXADECIMAL_REGEX,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: HexadecimalAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(hexadecimal()).toStrictEqual(action);
      expect(hexadecimal(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(hexadecimal('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies HexadecimalAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(hexadecimal(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies HexadecimalAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = hexadecimal();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid inputs', () => {
      const values = [
        '1A3F',
        '00ff',
        '7B2C',
        'F00D',
        'abc123',
        '123ABC',
        '000000',
        'FFFFFF',
        '0a1b2c',
        'deadBEEF',
        '0x0123456789abcDEF',
        '0HfedCBA9876543210',
      ];
      expectNoActionIssue(action, values);
    });
  });

  describe('should return dataset with issues', () => {
    const action = hexadecimal('message');
    const baseIssue: Omit<HexadecimalIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'hexadecimal',
      expected: null,
      message: 'message',
      requirement: HEXADECIMAL_REGEX,
    };

    test('for invalid inputs', () => {
      const values = [
        '',
        '1G',
        '1G4Z',
        '12345G',
        '#FFAABB',
        'XYZ123',
        'hello!',
        '11 22 33',
        '7G5H',
        '!@#$%^',
        'abc123xyz',
      ];
      expectActionIssue(action, baseIssue, values);
    });
  });
});

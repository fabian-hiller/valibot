import { describe, expect, test } from 'vitest';
import { HEX_COLOR_REGEX } from '../../regex.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import {
  hexColor,
  type HexColorAction,
  type HexColorIssue,
} from './hexColor.ts';

describe('hexColor', () => {
  describe('should return action object', () => {
    const baseAction: Omit<HexColorAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'hex_color',
      expects: null,
      requirement: HEX_COLOR_REGEX,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: HexColorAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(hexColor()).toStrictEqual(action);
      expect(hexColor(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(hexColor('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies HexColorAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(hexColor(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies HexColorAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = hexColor();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid inputs', () => {
      const values = [
        '#FFFFFF',
        '#000000',
        '#FF5733',
        '#FF5',
        '#336699',
        '#abcdef',
        '#123456',
        '#123ABC',
        '#000000ff',
      ];
      expectNoActionIssue(action, values);
    });
  });

  describe('should return dataset with issues', () => {
    const action = hexColor('message');
    const baseIssue: Omit<HexColorIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'hex_color',
      expected: null,
      message: 'message',
      requirement: HEX_COLOR_REGEX,
    };

    test('for invalid inputs', () => {
      const values = [
        '',
        '#',
        'test',
        '123456',
        '#GHIJKL',
        '#12345',
        '#123456789',
        '#00 00FF',
        '##0000FF',
        '#000FFZ',
        '#12345G',
        '#!23456',
      ];
      expectActionIssue(action, baseIssue, values);
    });
  });
});

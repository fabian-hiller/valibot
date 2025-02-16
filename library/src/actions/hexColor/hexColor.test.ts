import { describe, expect, test } from 'vitest';
import { HEX_COLOR_REGEX } from '../../regex.ts';
import type { StringIssue } from '../../schemas/index.ts';
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
      reference: hexColor,
      expects: null,
      requirement: HEX_COLOR_REGEX,
      async: false,
      '~run': expect.any(Function),
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
      const issues: [StringIssue] = [
        {
          kind: 'schema',
          type: 'string',
          input: null,
          expected: 'string',
          received: 'null',
          message: 'message',
        },
      ];
      expect(
        action['~run']({ typed: false, value: null, issues }, {})
      ).toStrictEqual({
        typed: false,
        value: null,
        issues,
      });
    });

    test('for 3 digits', () => {
      expectNoActionIssue(action, [
        '#000',
        '#FFF',
        '#F00',
        '#0F0',
        '#00F',
        '#123',
        '#abc',
      ]);
    });

    test('for 4 digits', () => {
      expectNoActionIssue(action, [
        '#0000',
        '#FFFF',
        '#F00F',
        '#0F0F',
        '#00FF',
        '#1234',
        '#abcd',
      ]);
    });

    test('for 6 digits', () => {
      expectNoActionIssue(action, [
        '#000000',
        '#FFFFFF',
        '#FF0000',
        '#00FF00',
        '#0000FF',
        '#123456',
        '#abcdef',
      ]);
    });

    test('for 8 digits', () => {
      expectNoActionIssue(action, [
        '#00000000',
        '#FFFFFFFF',
        '#FF0000FF',
        '#00FF00FF',
        '#0000FFFF',
        '#12345678',
        '#abcdefab',
      ]);
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

    test('for empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ', '\n']);
    });

    test('for missing # symbol', () => {
      expectActionIssue(action, baseIssue, [
        'FFF',
        'FFFF',
        'FFFFFF',
        'FFFFFFFF',
      ]);
    });

    test('for two # symbols', () => {
      expectActionIssue(action, baseIssue, [
        '##FFF',
        '##FFFF',
        '##FFFFFF',
        '##FFFFFFFF',
      ]);
    });

    test('for missing digits', () => {
      expectActionIssue(action, baseIssue, ['#']);
    });

    test('for blank spaces', () => {
      expectActionIssue(action, baseIssue, [' #FFF', '#FFF ', '#FFF FFF']);
    });

    test('for 1 digit', () => {
      expectActionIssue(action, baseIssue, ['#0', '#F', '#1', '#a']);
    });

    test('for 2 digits', () => {
      expectActionIssue(action, baseIssue, ['#00', '#FF', '#12', '#ab']);
    });

    test('for 5 digits', () => {
      expectActionIssue(action, baseIssue, [
        '#00000',
        '#FFFFF',
        '#12345',
        '#abcde',
      ]);
    });

    test('for 7 digits', () => {
      expectActionIssue(action, baseIssue, [
        '#0000000',
        '#FFFFFFF',
        '#1234567',
        '#abcdefa',
      ]);
    });

    test('for 9 digits', () => {
      expectActionIssue(action, baseIssue, [
        '#000000000',
        '#FFFFFFFFF',
        '#123456789',
        '#abcdefabc',
      ]);
    });

    test('for non hex chars', () => {
      expectActionIssue(action, baseIssue, [
        '#GGG',
        '#zzz',
        '#GGGG',
        '#zzzz',
        '#GGGGGG',
        '#zzzzzz',
        '#GGGGGGGG',
        '#zzzzzzzz',
      ]);
    });
  });
});

import { describe, expect, test } from 'vitest';
import { MAC48_REGEX, MAC64_REGEX } from '../../regex.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { mac, type MacAction, type MacIssue } from './mac.ts';

describe('mac', () => {
  describe('should return action object', () => {
    const baseAction: Omit<MacAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'mac',
      expects: null,
      requirement: [MAC48_REGEX, MAC64_REGEX],
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: MacAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(mac()).toStrictEqual(action);
      expect(mac(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(mac('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies MacAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(mac(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies MacAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = mac();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for mac48 address', () => {
      expectNoActionIssue(action, [
        'b6:05:20:67:f9:58',
        'b6-05-20-67-f9-58',
        'b605.2067.f958',
      ]);
    });

    test('for mac64 address', () => {
      expectNoActionIssue(action, [
        '00:25:96:FF:FE:12:34:56',
        '00-1A-2B-3C-4D-5E-6F-70',
        '0025.96FF.FE12.3456',
        '0025:96FF:FE12:3456',
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = mac('message');
    const baseIssue: Omit<MacIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'mac',
      expected: null,
      message: 'message',
      requirement: [MAC48_REGEX, MAC64_REGEX],
    };

    test('for empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ']);
    });

    test('for invalid mac formats', () => {
      const invalidMacs = [
        '00:1G:2B:3C:4D:5E',
        '00:1A:2B:3C:4D',
        '00:1A:2B:3C:4D:5E:6F',
        '00:1A:2B:3C:4D:5E:6F:70:80',
        'b605-2067-f958',
        '00_1A_2B_3C_4D_5E',
        '001A2B3C4D5E6F',
        'ZZ:ZZ:ZZ:ZZ:ZZ:ZZ',
        '00:1A:2B:3C:4D:5E:6F:70:80:90:AB',
        '001122334455',
        '00:1A:2B:3C:4D:5E:6F:70:ZZ',
        'GHIJ:KLNM:OPQR',
      ];
      expectActionIssue(action, baseIssue, invalidMacs);
    });
  });
});

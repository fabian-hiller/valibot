import { describe, expect, test } from 'vitest';
import { MAC48_REGEX } from '../../regex.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { mac48, type Mac48Action, type Mac48Issue } from './mac48.ts';

// TODO: Improve tests to cover all possible scenarios based on the regex used.

describe('mac48', () => {
  describe('should return action object', () => {
    const baseAction: Omit<Mac48Action<string, never>, 'message'> = {
      kind: 'validation',
      type: 'mac48',
      reference: mac48,
      expects: null,
      requirement: MAC48_REGEX,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: Mac48Action<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(mac48()).toStrictEqual(action);
      expect(mac48(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(mac48('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies Mac48Action<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(mac48(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies Mac48Action<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = mac48();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for 48-bit MAC address', () => {
      expectNoActionIssue(action, [
        'b6:05:20:67:f9:58',
        'b6-05-20-67-f9-58',
        'b605.2067.f958',
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = mac48('message');
    const baseIssue: Omit<Mac48Issue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'mac48',
      expected: null,
      message: 'message',
      requirement: MAC48_REGEX,
    };

    test('for empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ']);
    });

    test('for 64-bit MAC address', () => {
      expectActionIssue(action, baseIssue, [
        '00:25:96:FF:FE:12:34:56',
        '00-1A-2B-3C-4D-5E-6F-70',
        '0025.96FF.FE12.3456',
        '0025:96FF:FE12:3456',
      ]);
    });

    test('for invalid 48-bit MAC address', () => {
      expectActionIssue(action, baseIssue, [
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
      ]);
    });
  });
});

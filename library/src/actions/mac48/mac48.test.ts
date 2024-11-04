import { describe, expect, test } from 'vitest';
import { MAC48_REGEX } from '../../regex.ts';
import type { StringIssue } from '../../schemas/index.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { mac48, type Mac48Action, type Mac48Issue } from './mac48.ts';

describe('mac48', () => {
  describe('should return action object', () => {
    const baseAction: Omit<Mac48Action<string, never>, 'message'> = {
      kind: 'validation',
      type: 'mac48',
      reference: mac48,
      expects: null,
      requirement: MAC48_REGEX,
      async: false,
      '~validate': expect.any(Function),
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
        action['~validate']({ typed: false, value: null, issues }, {})
      ).toStrictEqual({
        typed: false,
        value: null,
        issues,
      });
    });

    test('for 48-bit MAC address', () => {
      expectNoActionIssue(action, [
        'b6:05:20:67:f9:58',
        'B6:05:20:67:F9:58',
        'b6-05-20-67-f9-58',
        'B6-05-20-67-F9-58',
        'b605.2067.f958',
        'B605.2067.F958',
        '00:00:00:00:00:00',
        '99:99:99:99:99:99',
        'aa:aa:aa:aa:aa:aa',
        'AA:AA:AA:AA:AA:AA',
        'ff:ff:ff:ff:ff:ff',
        'FF:FF:FF:FF:FF:FF',
        '00-00-00-00-00-00',
        '99-99-99-99-99-99',
        'aa-aa-aa-aa-aa-aa',
        'AA-AA-AA-AA-AA-AA',
        'ff-ff-ff-ff-ff-ff',
        'FF-FF-FF-FF-FF-FF',
        '0000.0000.0000',
        '9999.9999.9999',
        'aaaa.aaaa.aaaa',
        'AAAA.AAAA.AAAA',
        'ffff.ffff.ffff',
        'FFFF.FFFF.FFFF',
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
      expectActionIssue(action, baseIssue, ['', ' ', '\n']);
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
        '00-1G-2B-3C-4D-5E',
        '00-1A-2B-3C-4D',
        '00-1A-2B-3C-4D-5E-6F',
        '00-1A-2B-3C-4D-5E-6F-70-80',
        'b605-2067-f958',
        '00_1A_2B_3C_4D_5E',
        '001A2B3C4D5E6F',
        '00:1A:2B:3C:4D:5E:6F:70:80:90:AB',
        '001122334455',
        '00:1A:2B:3C:4D:5E:6F:70:ZZ',
        'GHIJ:KLNM:OPQR',
        '00:00:00:00:00:00:00',
        '00-00-00-00-00-00-00',
        '0:0:0:0:0:0',
        '000:000:000:000:000:000',
        '00:00:00:00:00',
        '0-0-0-0-0-0',
        '000-000-000-000-000-000',
        '00-00-00-00-00',
        '000.000.000',
        '00000.00000.00000',
        '0000.0000',
        '0000.0000.0000.0000',
        '-10:-10:-10:-10:-10:-10',
        '100:100:100:100:100:100',
        'gg:gg:gg:gg:gg:gg',
        'GG:GG:GG:GG:GG:GG',
        'zz:zz:zz:zz:zz:zz',
        'ZZ:ZZ:ZZ:ZZ:ZZ:ZZ',
        '-10--10--10--10--10--10',
        '100-100-100-100-100-100',
        'gg-gg-gg-gg-gg-gg',
        'GG-GG-GG-GG-GG-GG',
        'zz-zz-zz-zz-zz-zz',
        'ZZ-ZZ-ZZ-ZZ-ZZ-ZZ',
        '-1000.-1000.-1000',
        '10000.10000.10000',
        'gggg.gggg.gggg',
        'GGGG.GGGG.GGGG',
        'zzzz.zzzz.zzzz',
        'ZZZZ.ZZZZ.ZZZZ',
      ]);
    });
  });
});

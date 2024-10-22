import { describe, expect, test } from 'vitest';
import { MAC64_REGEX } from '../../regex.ts';
import type { StringIssue } from '../../schemas/index.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { mac64, type Mac64Action, type Mac64Issue } from './mac64.ts';

describe('mac64', () => {
  describe('should return action object', () => {
    const baseAction: Omit<Mac64Action<string, never>, 'message'> = {
      kind: 'validation',
      type: 'mac64',
      reference: mac64,
      expects: null,
      requirement: MAC64_REGEX,
      async: false,
      '~validate': expect.any(Function),
    };

    test('with undefined message', () => {
      const action: Mac64Action<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(mac64()).toStrictEqual(action);
      expect(mac64(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(mac64('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies Mac64Action<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(mac64(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies Mac64Action<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = mac64();

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

    test('for 64-bit MAC address', () => {
      expectNoActionIssue(action, [
        '00:25:96:FF:FE:12:34:56',
        '00-1A-2B-3C-4D-5E-6F-70',
        '0025.96FF.FE12.3456',
        '0025:96FF:FE12:3456',
        '00:00:00:00:00:00:00:00',
        '99:99:99:99:99:99:99:99',
        'aa:aa:aa:aa:aa:aa:aa:aa',
        'AA:AA:AA:AA:AA:AA:AA:AA',
        'ff:ff:ff:ff:ff:ff:ff:ff',
        'FF:FF:FF:FF:FF:FF:FF:FF',
        '00-00-00-00-00-00-00-00',
        '99-99-99-99-99-99-99-99',
        'aa-aa-aa-aa-aa-aa-aa-aa',
        'AA-AA-AA-AA-AA-AA-AA-AA',
        'ff-ff-ff-ff-ff-ff-ff-ff',
        'FF-FF-FF-FF-FF-FF-FF-FF',
        '0000.0000.0000.0000',
        '9999.9999.9999.9999',
        'aaaa.aaaa.aaaa.aaaa',
        'AAAA.AAAA.AAAA.AAAA',
        'ffff.ffff.ffff.ffff',
        'FFFF.FFFF.FFFF.FFFF',
        '0000:0000:0000:0000',
        '9999:9999:9999:9999',
        'aaaa:aaaa:aaaa:aaaa',
        'AAAA:AAAA:AAAA:AAAA',
        'ffff:ffff:ffff:ffff',
        'FFFF:FFFF:FFFF:FFFF',
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = mac64('message');
    const baseIssue: Omit<Mac64Issue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'mac64',
      expected: null,
      message: 'message',
      requirement: MAC64_REGEX,
    };

    test('for empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ', '\n']);
    });

    test('for 48-bit MAC address', () => {
      expectActionIssue(action, baseIssue, [
        'b6:05:20:67:f9:58',
        'b6-05-20-67-f9-58',
        'b605.2067.f958',
        '0000.0000.0000',
      ]);
    });

    test('for invalid 64-bit MAC address', () => {
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
        'ZZ:ZZ:ZZ:ZZ:ZZ:ZZ',
        '00:1A:2B:3C:4D:5E:6F:70:80:90:AB',
        '001122334455',
        '00:1A:2B:3C:4D:5E:6F:70:ZZ',
        'GHIJ:KLNM:OPQR',
        '0:0:0:0:0:0:0:0',
        '000:000:000:000:000:000:000:000',
        '00:00:00:00:00:00:00',
        '00:00:00:00:00:00:00:00:00',
        '0-0-0-0-0-0-0-0',
        '000-000-000-000-000-000-000-000',
        '00-00-00-00-00-00-00',
        '00-00-00-00-00-00-00-00-00',
        '000.000.000.000',
        '00000.00000.00000.00000',
        '0000.0000.0000.0000.0000',
        '000:000:000:000',
        '00000:00000:00000:00000',
        '0000:0000:0000',
        '0000:0000:0000:0000:0000',
        '-10:-10:-10:-10:-10:-10:-10:-10',
        '10000:10000:10000:10000:10000:10000:10000:10000',
        'zzzz:zzzz:zzzz:zzzz:zzzz:zzzz:zzzz:zzzz',
        'ZZZZ:ZZZZ:ZZZZ:ZZZZ:ZZZZ:ZZZZ:ZZZZ:ZZZZ',
        'gggg:gggg:gggg:gggg:gggg:gggg:gggg:gggg',
        'GGGG:GGGG:GGGG:GGGG:GGGG:GGGG:GGGG:GGGG',
        '-10--10--10--10--10--10--10--10',
        '10000-10000-10000-10000-10000-10000-10000-10000',
        'zzzz-zzzz-zzzz-zzzz-zzzz-zzzz-zzzz-zzzz',
        'ZZZZ-ZZZZ-ZZZZ-ZZZZ-ZZZZ-ZZZZ-ZZZZ-ZZZZ',
        'gggg-gggg-gggg-gggg-gggg-gggg-gggg-gggg',
        'GGGG-GGGG-GGGG-GGGG-GGGG-GGGG-GGGG-GGGG',
        '-1000.-1000.-1000.-1000',
        '10000.10000.10000.10000',
        'zzzz.zzzz.zzzz.zzzz',
        'ZZZZ.ZZZZ.ZZZZ.ZZZZ',
        'gggg.gggg.gggg.gggg',
        'GGGG.GGGG.GGGG.GGGG',
        '-1000:-1000:-1000:-1000',
        '10000:10000:10000:10000',
        'zzzz:zzzz:zzzz:zzzz',
        'ZZZZ:ZZZZ:ZZZZ:ZZZZ',
        'gggg:gggg:gggg:gggg',
        'GGGG:GGGG:GGGG:GGGG',
      ]);
    });
  });
});

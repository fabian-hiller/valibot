import { describe, expect, test } from 'vitest';
import { MAC_REGEX } from '../../regex.ts';
import type { StringIssue } from '../../schemas/index.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { mac, type MacAction, type MacIssue } from './mac.ts';

describe('mac', () => {
  describe('should return action object', () => {
    const baseAction: Omit<MacAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'mac',
      reference: mac,
      expects: null,
      requirement: MAC_REGEX,
      async: false,
      '~run': expect.any(Function),
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
    const action = mac('message');
    const baseIssue: Omit<MacIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'mac',
      expected: null,
      message: 'message',
      requirement: MAC_REGEX,
    };

    test('for empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ', '\n']);
    });

    test('for invalid MAC address', () => {
      expectActionIssue(action, baseIssue, [
        // intended to test both - mac48 and mac64 parts of the regular expression
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
        '00:00:00:00:00:00:00',
        '00-00-00-00-00-00-00',
        // intended to test mac48 part of the regular expression
        '0:0:0:0:0:0',
        '000:000:000:000:000:000',
        '00:00:00:00:00',
        '0-0-0-0-0-0',
        '000-000-000-000-000-000',
        '00-00-00-00-00',
        '000.000.000',
        '00000.00000.00000',
        '-10:-10:-10:-10:-10:-10',
        '100:100:100:100:100:100',
        'gg:gg:gg:gg:gg:gg',
        'GG:GG:GG:GG:GG:GG',
        'zz:zz:zz:zz:zz:zz',
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
        // intended to test mac64 part of the regular expression
        '0:0:0:0:0:0:0:0',
        '000:000:000:000:000:000:000:000',
        '00:00:00:00:00:00:00:00:00',
        '0-0-0-0-0-0-0-0',
        '000-000-000-000-000-000-000-000',
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

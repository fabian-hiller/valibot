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
      '~validate': expect.any(Function),
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
        'ff:ff:ff:ff:ff:ff',
        '00-00-00-00-00-00',
        'ff-ff-ff-ff-ff-ff',
        '0000.0000.0000',
        'ffff.ffff.ffff',
      ]);
    });

    test('for 64-bit MAC address', () => {
      expectNoActionIssue(action, [
        '00:25:96:FF:FE:12:34:56',
        '00-1A-2B-3C-4D-5E-6F-70',
        '0025.96FF.FE12.3456',
        '0025:96FF:FE12:3456',
        '00:00:00:00:00:00:00:00',
        'ff:ff:ff:ff:ff:ff:ff:ff',
        'ab:AB:cd:CD:ee:EE:01:23',
        '00-00-00-00-00-00-00-00',
        'ff-ff-ff-ff-ff-ff-ff-ff',
        'ab-AB-cd-CD-ee-EE-01-23',
        '0000.0000.0000.0000',
        'ffff.ffff.ffff.ffff',
        'abcd.ABCD.0123.4567',
        '0000:0000:0000:0000',
        'ffff:ffff:ffff:ffff',
        'abcd:ABCD:0123:4567',
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
        'b605-2067-f958',
        '00_1A_2B_3C_4D_5E',
        '001A2B3C4D5E6F',
        'ZZ:ZZ:ZZ:ZZ:ZZ:ZZ',
        '00:1A:2B:3C:4D:5E:6F:70:80:90:AB',
        '001122334455',
        '00:1A:2B:3C:4D:5E:6F:70:ZZ',
        'GHIJ:KLNM:OPQR',
        '00-1G-2B-3C-4D-5E',
        '00-1A-2B-3C-4D',
        '00-1A-2B-3C-4D-5E-6F',
        '00-1A-2B-3C-4D-5E-6F-70-80',
        '0000.0000',
        '0000.0000.0000.0000.0000',
        '000.000.000',
        '000.000.000.000',
        '00000.00000.00000',
        '00000.00000.00000.00000',
        '0000-0000-0000',
        '0000-0000-0000-0000',
        '0000-0000-0000-0000-0000',
        '0000:0000:0000',
        '0000:0000:0000:0000:0000',
        '000:000:000:000',
        '00000:00000:00000:00000',
        // intended to test mac48 part of the regular expression
        'G0:12:34:56:78:99',
        'g0:12:34:56:78:99',
        '0g:11:22:33:44:55',
        '00:g0:aa:bb:cc:dd',
        '00:1g:2b:3c:4d:5e',
        '00:1a:gb:3c:4d:5e',
        '00:00:0g:00:00:00',
        'a1:b2:c3:g4:d5:e6',
        '12:34:56:7g:89:99',
        '00:00:00:00:g0:00',
        '00:00:00:00:0g:00',
        'a1:b2:c3:d4:e4:g5',
        '00:10:20:30:40:5g',
        'Ga-0b-0c-0d-0e-0f',
        'ga-0b-0c-0d-0e-0f',
        '0g-00-00-00-00-00',
        '00-g0-00-00-00-00',
        '1a-2g-3c-4d-5e-6f',
        '01-02-g3-04-05-06',
        '0a-0b-0g-0c-0d-0e',
        'a0-b0-c0-g0-d0-e0',
        '01-02-03-0g-04-05',
        '12-34-56-78-g9-99',
        '0a-1b-2c-3d-4g-5f',
        '00-00-00-00-00-g0',
        '00-00-00-00-00-0g',
        'G123.B456.C789',
        'g123.B456.C789',
        '0g23.4567.8999',
        '00g1.0002.0003',
        'defg.deff.deff',
        '000g.1111.2222',
        '1234.g567.8899',
        'abcd.egfa.bcde',
        '00a0.00g0.00c0',
        '000a.000g.000c',
        '0123.0456.g789',
        '0012.0034.0g56',
        'ab00.cd00.efg0',
        '00ab.00cd.0efg',
        // intended to test mac64 part of the regular expression
        '0:0:0:0:0:0:0:0',
        '000:000:000:000:000:000:000:000',
        'g0:00:00:00:00:00:00:00',
        '0g:00:00:00:00:00:00:00',
        '00:g0:00:00:00:00:00:00',
        '00:0g:00:00:00:00:00:00',
        '00:00:g0:00:00:00:00:00',
        '00:00:0g:00:00:00:00:00',
        '00:00:00:g0:00:00:00:00',
        '00:00:00:0g:00:00:00:00',
        '00:00:00:00:g0:00:00:00',
        '00:00:00:00:0g:00:00:00',
        '00:00:00:00:00:g0:00:00',
        '00:00:00:00:00:0g:00:00',
        '00:00:00:00:00:00:g0:00',
        '00:00:00:00:00:00:0g:00',
        '00:00:00:00:00:00:00:g0',
        '00:00:00:00:00:00:00:0g',
        '01:23:45:67:89:G0:12:34',
        '0-0-0-0-0-0-0-0',
        '000-000-000-000-000-000-000-000',
        'g0-00-00-00-00-00-00-00',
        '0g-00-00-00-00-00-00-00',
        '00-g0-00-00-00-00-00-00',
        '00-0g-00-00-00-00-00-00',
        '00-00-g0-00-00-00-00-00',
        '00-00-0g-00-00-00-00-00',
        '00-00-00-g0-00-00-00-00',
        '00-00-00-0g-00-00-00-00',
        '00-00-00-00-g0-00-00-00',
        '00-00-00-00-0g-00-00-00',
        '00-00-00-00-00-g0-00-00',
        '00-00-00-00-00-0g-00-00',
        '00-00-00-00-00-00-g0-00',
        '00-00-00-00-00-00-0g-00',
        '00-00-00-00-00-00-00-g0',
        '00-00-00-00-00-00-00-0g',
        '01-23-45-67-89-G0-12-34',
        'g000.0000.0000.0000',
        '0g00.0000.0000.0000',
        '00g0.0000.0000.0000',
        '000g.0000.0000.0000',
        '0000.g000.0000.0000',
        '0000.0g00.0000.0000',
        '0000.00g0.0000.0000',
        '0000.000g.0000.0000',
        '0000.0000.g000.0000',
        '0000.0000.0g00.0000',
        '0000.0000.00g0.0000',
        '0000.0000.000g.0000',
        '0000.0000.0000.g000',
        '0000.0000.0000.0g00',
        '0000.0000.0000.00g0',
        '0000.0000.0000.000g',
        '0123.4567.89G0.1234',
        'g000:0000:0000:0000',
        '0g00:0000:0000:0000',
        '00g0:0000:0000:0000',
        '000g:0000:0000:0000',
        '0000:g000:0000:0000',
        '0000:0g00:0000:0000',
        '0000:00g0:0000:0000',
        '0000:000g:0000:0000',
        '0000:0000:g000:0000',
        '0000:0000:0g00:0000',
        '0000:0000:00g0:0000',
        '0000:0000:000g:0000',
        '0000:0000:0000:g000',
        '0000:0000:0000:0g00',
        '0000:0000:0000:00g0',
        '0000:0000:0000:000g',
        '0123:4567:89G0:1234',
      ]);
    });
  });
});

import { describe, expect, test } from 'vitest';
import { IPV4_REGEX } from '../../regex.ts';
import type { StringIssue } from '../../schemas/index.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { ipv4, type Ipv4Action, type Ipv4Issue } from './ipv4.ts';

describe('ipv4', () => {
  describe('should return action object', () => {
    const baseAction: Omit<Ipv4Action<string, never>, 'message'> = {
      kind: 'validation',
      type: 'ipv4',
      reference: ipv4,
      expects: null,
      requirement: IPV4_REGEX,
      async: false,
      '~validate': expect.any(Function),
    };

    test('with undefined message', () => {
      const action: Ipv4Action<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(ipv4()).toStrictEqual(action);
      expect(ipv4(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(ipv4('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies Ipv4Action<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(ipv4(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies Ipv4Action<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = ipv4();

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

    test('for IPv4 address', () => {
      expectNoActionIssue(action, [
        '192.168.1.1',
        '127.0.0.1',
        '0.0.0.0',
        '255.255.255.255',
        '0.0.0.1',
        '1.0.0.0',
        '240.0.0.0',
        '255.0.0.0',
        '10.255.255.255',
        '192.168.0.255',
        '5.8.6.7',
        '9.9.9.9',
        '10.10.10.10',
        '50.60.70.80',
        '90.90.90.90',
        '19.19.19.19',
        '49.39.29.79',
        '99.99.99.99',
        '16.15.15.17',
        '56.67.82.74',
        '95.95.95.95',
        '100.100.100.100',
        '140.170.150.160',
        '190.190.190.190',
        '109.109.109.109',
        '189.179.169.159',
        '199.199.199.199',
        '106.108.107.104',
        '116.136.156.176',
        '196.196.196.196',
        '200.200.200.200',
        '210.220.210.220',
        '240.240.240.240',
        '209.209.209.209',
        '239.239.239.229',
        '249.249.249.249',
        '207.207.207.207',
        '237.247.247.237',
        '247.247.247.247',
        '250.250.250.250',
        '251.252.254.253',
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = ipv4('message');
    const baseIssue: Omit<Ipv4Issue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'ipv4',
      expected: null,
      message: 'message',
      requirement: IPV4_REGEX,
    };

    test('for empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ', '  ', '\n', '\t']);
    });

    test('for invalid IPv4 address', () => {
      expectActionIssue(action, baseIssue, [
        '1',
        '1.2',
        '1.2.3',
        '0.0.0.0.0',
        '1.2.3.4.5',
        '1.2.3.4.5.6',
        '1234.0.0.0',
        '0.0.0.500',
        '0.260.268.0',
        '256.256.256.256',
        '259.259.259.259',
        '910.910.910.910',
        '999.999.999.999',
        '192.168.1.01',
        '200.05.6.7',
        '01.01.01.01',
        '04.05.06.07',
        '09.09.09.09',
        '0.00.0.0',
        '-1.-1.1.1',
        '-1.0.0.0',
        '0.-255.0.0',
        '1.-2.-3.4',
        '-200.-150.-100.-175',
        'a.a.a.a',
        'abc.def.ghi.jkl',
        'a0.a0.a0.a0',
        '.100.100.100',
        '0..0.0',
        '0...0',
        '255.255.255.',
        '...',
        '+1.2.3.4',
        '1.2.3.4+',
        '1.+2.3.4',
        ' 0.0.0.0',
        '\n0.0.0.0',
        '0.\t0.0.0',
        '0.0.0.0 ',
        '100. 0.100.0',
        '1-2.3.4',
        '1.2,3.4',
        '100.125.150/175',
        '255\\255\\255\\255',
      ]);
    });

    test('for IPv6 address', () => {
      expectActionIssue(action, baseIssue, [
        '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
        'FE80:0000:0000:0000:0202:B3FF:FE1E:8329',
        'fe80::1ff:fe23:4567:890a',
        '2001:db8:85a3:8d3:1319:8a2e:370:7348',
        // IPv4-mapped IPv6
        '::ffff:192.168.1.1',
        '::ffff:0.0.0.0',
        '::ffff:255.255.255.255',
      ]);
    });
  });
});

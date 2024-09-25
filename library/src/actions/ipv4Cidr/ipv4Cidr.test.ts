import { describe, expect, test } from 'vitest';
import { IPV4_CIDR_REGEX } from '../../regex.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { ipv4Cidr, type Ipv4CidrAction, type Ipv4CidrIssue } from './ipv4Cidr.ts';

// TODO: Improve tests to cover all possible scenarios based on the regex used.

describe('ipv4', () => {
  describe('should return action object', () => {
    const baseAction: Omit<Ipv4CidrAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'ipv4_cidr',
      reference: ipv4Cidr,
      expects: null,
      requirement: IPV4_CIDR_REGEX,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: Ipv4CidrAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(ipv4Cidr()).toStrictEqual(action);
      expect(ipv4Cidr(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(ipv4Cidr('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies Ipv4CidrAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(ipv4Cidr(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies Ipv4CidrAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = ipv4Cidr();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for IPv4 address', () => {
      expectNoActionIssue(action, [
        '192.168.1.1/24',
        '127.0.0.1/32',
        '0.0.0.0/16',
        '255.255.255.255/24',
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = ipv4Cidr('message');
    const baseIssue: Omit<Ipv4CidrIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'ipv4_cidr',
      expected: null,
      message: 'message',
      requirement: IPV4_CIDR_REGEX,
    };

    test('for empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ', '\n']);
    });

    test('for invalid IPv4 address', () => {
      expectActionIssue(action, baseIssue, [
        '1/24',
        '-1.0.0.0/24',
        '0..0.0.0/12',
        '1234.0.0.0/16',
        '256.256.256.256/24',
        '1.2.3/24',
        '0.0.0.0.0/12',
        'a.a.a.a/24',
        '192.0.0.1/33',
        '82.78.37.80/-1',
        '82.78.37.80/40',
      ]);
    });

    test('for IPv6 address', () => {
      expectActionIssue(action, baseIssue, [
        '2001:0db8:85a3:0000:0000:8a2e:0370:7334/24',
        'FE80:0000:0000:0000:0202:B3FF:FE1E:8329/12',
        'fe80::1ff:fe23:4567:890a/32',
        '2001:db8:85a3:8d3:1319:8a2e:370:7348/128',
      ]);
    });
  });
});

import { describe, expect, test } from 'vitest';
import { IPV6_CIDR_REGEX } from '../../regex.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { ipv6Cidr, type Ipv6CidrAction, type Ipv6CidrIssue } from './ipv6Cidr.ts';

// TODO: Improve tests to cover all possible scenarios based on the regex used.

describe('ipv6Cidr', () => {
  describe('should return action object', () => {
    const baseAction: Omit<Ipv6CidrAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'ipv6_cidr',
      reference: ipv6Cidr,
      expects: null,
      requirement: IPV6_CIDR_REGEX,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: Ipv6CidrAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(ipv6Cidr()).toStrictEqual(action);
      expect(ipv6Cidr(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(ipv6Cidr('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies Ipv6CidrAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(ipv6Cidr(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies Ipv6CidrAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = ipv6Cidr();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for ipv6Cidr address', () => {
      expectNoActionIssue(action, [
        '2001:0db8:85a3:0000:0000:8a2e:0370:7334/12',
        'FE80:0000:0000:0000:0202:B3FF:FE1E:8329/64',
        'fe80::1ff:fe23:4567:890a/128',
        '2001:db8:85a3:8d3:1319:8a2e:370:7348/96',
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = ipv6Cidr('message');
    const baseIssue: Omit<Ipv6CidrIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'ipv6_cidr',
      expected: null,
      message: 'message',
      requirement: IPV6_CIDR_REGEX,
    };

    test('for empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ', '\n']);
    });

    test('for invalid ipv6Cidr address', () => {
      expectActionIssue(action, baseIssue, [
        'd329:1be4:25b4:db47:a9d1:dc71:4926:992c:14af/12',
        'd5e7:7214:2b78::3906:85e6:53cc:709:32ba/64',
        '8f69::c757:395e:976e::3441/128',
        '54cb::473f:d516:0.255.256.22/48',
        '54cb::473f:d516:192.168.1/96',
        'test:test:test:test:test:test:test:test/1',
        '5eb9:bc94:d0fb:3f9a:173a:74c1:86ca:1ef7/129',
        '5b54:5d3e:b867:f367:2d53:8b26:ce9/-1',
        'f9c9:1876:9b59:c6f3:8a36:44a7:382d:1f50/130',
        'f48:9dbd:ae0e:4586:8209:38a4:a191:2b0e/200',
        'f48:9dbd:ae0e:4586:8209:38a4:a191:2b0e/1128',
      ]);
    });

    test('for IPv4 address', () => {
      expectActionIssue(action, baseIssue, [
        '192.168.1.1/12',
        '127.0.0.1/8',
        '0.0.0.0/24',
        '255.255.255.255/32',
        '237.84.2.178/33',
        '82.78.37.80/-1',
        '82.78.37.80/40',
        '82.78.37.80/128',
      ]);
    });
  });
});

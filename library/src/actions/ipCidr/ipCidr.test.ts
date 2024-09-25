import { describe, expect, test } from 'vitest';
import { IP_CIDR_REGEX } from '../../regex.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { ipCidr, type IpCidrAction, type IpCidrIssue } from './ipCidr.ts';

// TODO: Improve tests to cover all possible scenarios based on the regex used.

describe('ipCidr', () => {
  describe('should return action object', () => {
    const baseAction: Omit<IpCidrAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'ip_cidr',
      reference: ipCidr,
      expects: null,
      requirement: IP_CIDR_REGEX,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: IpCidrAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(ipCidr()).toStrictEqual(action);
      expect(ipCidr(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(ipCidr('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies IpCidrAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(ipCidr(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies IpCidrAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = ipCidr();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for IPv4 address', () => {
      expectNoActionIssue(action, [
        '192.168.1.1/0',
        '127.0.0.1/9',
        '0.0.0.0/10',
        '255.255.255.255/11',
        '237.84.2.178/19',
        '89.207.132.170/20',
        '237.84.2.178/21',
        '55.151.133.223/29',
        '244.178.44.111/30',
        '234.218.86.91/32',
      ]);
    });

    test('for IPv6 address', () => {
      expectNoActionIssue(action, [
        '2001:0db8:85a3:0000:0000:8a2e:0370:7334/0',
        'FE80:0000:0000:0000:0202:B3FF:FE1E:8329/9',
        'fe80::1ff:fe23:4567:890a/10',
        '2001:db8:85a3:8d3:1319:8a2e:370:7348/11',
        'e05b:3266:e43f:3fdf:a34c:c11:dbc4:349f/19',
        'f053:688e:431:c36b:a452:425:8c88:713e/20',
        '620a:9614:8852:a772:9c03:fd43:34a2:3c91/21',
        '58e9:b974:fd6a:ff97:5376:22c2:321f:2144/99',
        '7066:1b31:6757:e5cf:bd06:a46b:2e97:838f/100',
        '3640:328f:e171:975:cbd1:1ac:5e72:7bfd/101',
        'f9c9:1876:9b59:c6f3:8a36:44a7:382d:1f50/110',
        'f48:9dbd:ae0e:4586:8209:38a4:a191:2b0e/119',
        'c159:7a14:58ba:ca7c:d3d3:98ce:6978:68e3/120',
        '3457:589a:2291:1598:be2:16d7:4902:1e37/121',
        '5eb9:bc94:d0fb:3f9a:173a:74c1:86ca:1ef7/128',
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = ipCidr('message');
    const baseIssue: Omit<IpCidrIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'ip_cidr',
      expected: null,
      message: 'message',
      requirement: IP_CIDR_REGEX,
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
        '1.2.3/32',
        '0.0.0.0.0/12',
        'a.a.a.a/10',
        '237.84.2.178/33',
        '82.78.37.80/-1',
        '82.78.37.80/40',
        '82.78.37.80/128',
      ]);
    });

    test('for invalid IPv6 address', () => {
      expectActionIssue(action, baseIssue, [
        'd329:1be4:25b4:db47:a9d1:dc71:4926:992c:14af/32',
        'd5e7:7214:2b78::3906:85e6:53cc:709:32ba/40',
        '8f69::c757:395e:976e::3441/64',
        '54cb::473f:d516:0.255.256.22/72',
        '54cb::473f:d516:192.168.1/86',
        'test:test:test:test:test:test:test:test/24',
        'f48:9dbd:ae0e:4586:8209:38a4:a191:2b0e/129',
        '5b54:5d3e:b867:f367:2d53:8b26:ce9/-1',
        'f9c9:1876:9b59:c6f3:8a36:44a7:382d:1f50/130',
        'f48:9dbd:ae0e:4586:8209:38a4:a191:2b0e/200',
        'f48:9dbd:ae0e:4586:8209:38a4:a191:2b0e/1128',
      ]);
    });
  });
});

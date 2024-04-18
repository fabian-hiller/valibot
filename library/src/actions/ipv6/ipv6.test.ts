import { describe, expect, test } from 'vitest';
import { IPV6_REGEX } from '../../regex.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { ipv6, type IpV6Action, type IpV6Issue } from './ipv6.ts';

describe('ipv6', () => {
  describe('should return action object', () => {
    const baseAction: Omit<IpV6Action<string, never>, 'message'> = {
      kind: 'validation',
      type: 'ipv6',
      expects: null,
      requirement: IPV6_REGEX,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: IpV6Action<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(ipv6()).toStrictEqual(action);
      expect(ipv6(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(ipv6('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies IpV6Action<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(ipv6(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies IpV6Action<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = ipv6();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for ipv6 address', () => {
      expectNoActionIssue(action, [
        '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
        'FE80:0000:0000:0000:0202:B3FF:FE1E:8329',
        'fe80::1ff:fe23:4567:890a',
        '2001:db8:85a3:8d3:1319:8a2e:370:7348',
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = ipv6('message');
    const baseIssue: Omit<IpV6Issue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'ipv6',
      expected: null,
      message: 'message',
      requirement: IPV6_REGEX,
    };

    test('for empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ']);
    });

    test('for invalid ip formats', () => {
      const invalidips = [
        '1',
        '-1.0.0.0',
        '0..0.0.0',
        '1234.0.0.0',
        '256.256.256.256',
        '1.2.3',
        '0.0.0.0.0',
        'test:test:test:test:test:test:test:test',
      ];
      expectActionIssue(action, baseIssue, invalidips);
    });

    test('for ipv6 address', () => {
      expectActionIssue(action, baseIssue, [
        '192.168.1.1',
        '127.0.0.1',
        '0.0.0.0',
        '255.255.255.255',
      ]);
    });
  });
});

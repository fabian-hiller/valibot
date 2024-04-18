import { describe, expect, test } from 'vitest';
import { IPV4_REGEX, IPV6_REGEX } from '../../regex.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { ip, type IpAction, type IpIssue } from './ip.ts';

describe('ip', () => {
  describe('should return action object', () => {
    const baseAction: Omit<IpAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'ip',
      expects: null,
      requirement: [IPV4_REGEX, IPV6_REGEX],
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: IpAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(ip()).toStrictEqual(action);
      expect(ip(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(ip('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies IpAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(ip(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies IpAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = ip();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for ipv4 address', () => {
      expectNoActionIssue(action, [
        '192.168.1.1',
        '127.0.0.1',
        '0.0.0.0',
        '255.255.255.255',
      ]);
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
    const action = ip('message');
    const baseIssue: Omit<IpIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'ip',
      expected: null,
      message: 'message',
      requirement: [IPV4_REGEX, IPV6_REGEX],
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
  });
});

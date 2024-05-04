import { describe, expect, test } from 'vitest';
import { IPV4_REGEX } from '../../regex.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { ipv4, type Ipv4Action, type Ipv4Issue } from './ipv4.ts';

// TODO: Improve tests to cover all possible scenarios based on the regex used.

describe('ipv4', () => {
  describe('should return action object', () => {
    const baseAction: Omit<Ipv4Action<string, never>, 'message'> = {
      kind: 'validation',
      type: 'ipv4',
      reference: ipv4,
      expects: null,
      requirement: IPV4_REGEX,
      async: false,
      _run: expect.any(Function),
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
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for IPv4 address', () => {
      expectNoActionIssue(action, [
        '192.168.1.1',
        '127.0.0.1',
        '0.0.0.0',
        '255.255.255.255',
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
      expectActionIssue(action, baseIssue, ['', ' ', '\n']);
    });

    test('for invalid IPv4 address', () => {
      expectActionIssue(action, baseIssue, [
        '1',
        '-1.0.0.0',
        '0..0.0.0',
        '1234.0.0.0',
        '256.256.256.256',
        '1.2.3',
        '0.0.0.0.0',
        'a.a.a.a',
      ]);
    });

    test('for IPv6 address', () => {
      expectActionIssue(action, baseIssue, [
        '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
        'FE80:0000:0000:0000:0202:B3FF:FE1E:8329',
        'fe80::1ff:fe23:4567:890a',
        '2001:db8:85a3:8d3:1319:8a2e:370:7348',
      ]);
    });
  });
});

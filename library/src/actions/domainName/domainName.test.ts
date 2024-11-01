import { describe, expect, test } from 'vitest';
import { DOMAIN_NAME_REGEX } from '../../regex.ts';
import type { StringIssue } from '../../schemas/index.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import {
  domainName,
  type DomainNameAction,
  type DomainNameIssue,
} from './domainName.ts';

describe('domainName', () => {
  describe('should return action object', () => {
    const baseAction: Omit<DomainNameAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'domainName',
      reference: domainName,
      expects: null,
      requirement: DOMAIN_NAME_REGEX,
      async: false,
      '~validate': expect.any(Function),
    };

    test('with undefined message', () => {
      const action: DomainNameAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(domainName()).toStrictEqual(action);
      expect(domainName(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(domainName('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies DomainNameAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(domainName(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies DomainNameAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = domainName();

    // General tests

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

    test("should match 'example.com' - Standard domain", () => {
      expectNoActionIssue(action, ['example.com']);
    });

    test("should match 'example.org' - Another common TLD", () => {
      expectNoActionIssue(action, ['example.org']);
    });

    test("should match 'subdomain.example.com' - Subdomains are allowed as separate checks", () => {
      expectNoActionIssue(action, ['subdomain.example.com']);
    });

    test("should match 'e.com' - Minimal length for the main part of the domain", () => {
      expectNoActionIssue(action, ['e.com']);
    });

    test("should match 'test-domain.com' - Hyphens within the domain name are allowed", () => {
      expectNoActionIssue(action, ['test-domain.com']);
    });

    test("should match '123domain.com' - Numbers are allowed in the domain part", () => {
      expectNoActionIssue(action, ['123domain.com']);
    });

    test("should match 'domain123.com' - Numbers at the end are valid", () => {
      expectNoActionIssue(action, ['domain123.com']);
    });

    test("should match 'sub.domain123.co' - Valid short TLD with subdomains", () => {
      expectNoActionIssue(action, ['sub.domain123.co']);
    });

    test("should match 'domain-name.co.uk' - Valid multiple parts with different TLDs", () => {
      expectNoActionIssue(action, ['domain-name.co.uk']);
    });

    test("should match 'd.coop' - Longer TLD with alphabetic characters", () => {
      expectNoActionIssue(action, ['d.coop']);
    });
  });

  describe('should return dataset with issues', () => {
    const action = domainName('message');
    const baseIssue: Omit<DomainNameIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'domainName',
      expected: null,
      message: 'message',
      requirement: DOMAIN_NAME_REGEX,
    };

    // General tests

    test('for empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ', '\n']);
    });

    test('for simple strings', () => {
      expectActionIssue(action, baseIssue, [
        'domainName',
        'domainNameexamplecom',
      ]);
    });

    test('for domainName with spaces', () => {
      expectActionIssue(action, baseIssue, [
        ' domainName@example.com',
        'e mail@example.com',
        'domainName @example.com',
        'domainName@ example.com',
        'domainName@exa mple.com',
        'domainName@example. com',
        'domainName@example.com ',
      ]);
    });

    // Invalid domain names

    test("should not match '-example.com' - Starts with a hyphen", () => {
      expectActionIssue(action, baseIssue, ['-example.com']);
    });

    test("should not match 'example-.com' - Ends with a hyphen", () => {
      expectActionIssue(action, baseIssue, ['example-.com']);
    });

    test("should not match 'example..com' - Double dot within the domain", () => {
      expectActionIssue(action, baseIssue, ['example..com']);
    });

    test("should not match '.example.com' - Leading dot", () => {
      expectActionIssue(action, baseIssue, ['.example.com']);
    });

    test("should not match 'example.c' - TLD too short (less than 2 characters)", () => {
      expectActionIssue(action, baseIssue, ['example.c']);
    });

    test("should not match 'example.commmerce' - TLD too long (more than 6 characters)", () => {
      expectActionIssue(action, baseIssue, ['example.commmerce']);
    });

    test("should not match 'ex@mple.com' - Invalid character (@) in the domain name", () => {
      expectActionIssue(action, baseIssue, ['ex@mple.com']);
    });

    test("should not match 'example_domain.com' - Invalid underscore (_) in the domain name", () => {
      expectActionIssue(action, baseIssue, ['example_domain.com']);
    });

    test("should not match 'toolongdomainnamethatexceeds63characterslimitbutthisisnotlongerbutnowitis.com' - Domain name exceeds 63 characters", () => {
      expectActionIssue(action, baseIssue, [
        'toolongdomainnamethatexceeds63characterslimitbutthisisnotlongerbutnowitis.com',
      ]);
    });

    test("should not match 'domain.-com' - TLD cannot start with a hyphen", () => {
      expectActionIssue(action, baseIssue, ['domain.-com']);
    });
  });
});

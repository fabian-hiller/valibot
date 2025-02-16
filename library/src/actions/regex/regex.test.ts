import { describe, expect, test } from 'vitest';
import type { StringIssue } from '../../schemas/index.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { regex, type RegexAction, type RegexIssue } from './regex.ts';

describe('regex', () => {
  const requirement = /^ID-\d{3}$/u;

  describe('should return action object', () => {
    const baseAction: Omit<RegexAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'regex',
      reference: regex,
      expects: `${requirement}`,
      requirement,
      async: false,
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const action: RegexAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(regex(requirement)).toStrictEqual(action);
      expect(regex(requirement, undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(regex(requirement, 'message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies RegexAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(regex(requirement, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies RegexAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = regex(requirement);

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

    test('for matching strings', () => {
      expectNoActionIssue(action, ['ID-000', 'ID-123', 'ID-999']);
    });
  });

  describe('should return dataset with issues', () => {
    const action = regex(requirement, 'message');

    const baseIssue: Omit<RegexIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'regex',
      expected: `${requirement}`,
      requirement,
      message: 'message',
    };

    test('for empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ', '\n']);
    });

    test('for blank spaces', () => {
      expectActionIssue(action, baseIssue, [' ID-000', 'ID-000 ', ' ID-000 ']);
    });

    test('for missing separator', () => {
      expectActionIssue(action, baseIssue, ['ID000']);
    });

    test('for invalid separators', () => {
      expectActionIssue(action, baseIssue, [
        'ID 000',
        'ID:000',
        'ID–000',
        'ID_000',
        'ID/000',
        'ID.000',
      ]);
    });

    test('for invalid prefix', () => {
      expectActionIssue(action, baseIssue, [
        'id-000',
        'D-000',
        'I-000',
        'AD-000',
        'IA-000',
      ]);
    });

    test('for invalid number', () => {
      expectActionIssue(action, baseIssue, [
        'ID-0', // 1 digit
        'ID-00', // 2 digits
        'ID-0000', // 4 digits
        'ID-00000', // 5 digits
        'ID-A00', // letter
        'ID-0A0', // letter
        'ID-00A', // letter
        'ID-a00', // letter
        'ID-0a0', // letter
        'ID-00a', // letter
      ]);
    });
  });
});

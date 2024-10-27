import { describe, expect, test } from 'vitest';
import type { StringIssue } from '../../schemas/index.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import {
  startsWith,
  type StartsWithAction,
  type StartsWithIssue,
} from './startsWith.ts';

describe('startsWith', () => {
  describe('should return action object', () => {
    const baseAction: Omit<
      StartsWithAction<string, 'abc', never>,
      'message'
    > = {
      kind: 'validation',
      type: 'starts_with',
      reference: startsWith,
      expects: '"abc"',
      requirement: 'abc',
      async: false,
      '~validate': expect.any(Function),
    };

    test('with undefined message', () => {
      const action: StartsWithAction<string, 'abc', undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(startsWith('abc')).toStrictEqual(action);
      expect(startsWith('abc', undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(startsWith('abc', 'message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies StartsWithAction<string, 'abc', string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(startsWith('abc', message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies StartsWithAction<string, 'abc', typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = startsWith('abc');

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

    test('for valid inputs', () => {
      expectNoActionIssue(action, ['abc', 'abcdef', 'abc123', 'abc123def']);
    });
  });

  describe('should return dataset with issues', () => {
    const action = startsWith('abc', 'message');
    const baseIssue: Omit<
      StartsWithIssue<string, 'abc'>,
      'input' | 'received'
    > = {
      kind: 'validation',
      type: 'starts_with',
      expected: '"abc"',
      message: 'message',
      requirement: 'abc',
    };

    test('for invalid inputs', () => {
      expectActionIssue(
        action,
        baseIssue,
        [
          '',
          'a',
          'ab',
          ' abc',
          'Abc',
          'a123',
          'ab123',
          'abdef',
          'aabc',
          'zabc',
          'zabcdef',
        ],
        (value) => `"${value.slice(0, 'abc'.length)}"`
      );
    });
  });
});

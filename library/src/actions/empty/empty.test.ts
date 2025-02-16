import { describe, expect, test } from 'vitest';
import type { StringIssue } from '../../schemas/index.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { empty, type EmptyAction, type EmptyIssue } from './empty.ts';

describe('empty', () => {
  describe('should return action object', () => {
    const baseAction: Omit<EmptyAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'empty',
      reference: empty,
      expects: '0',
      async: false,
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const action: EmptyAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(empty()).toStrictEqual(action);
      expect(empty(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(empty('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies EmptyAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(empty(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies EmptyAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = empty();

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

    test('for valid strings', () => {
      expectNoActionIssue(action, ['']);
    });

    test('for valid arrays', () => {
      expectNoActionIssue(action, [[]]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = empty('message');
    const baseIssue: Omit<EmptyIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'empty',
      expected: '0',
      message: 'message',
    };

    test('for invalid strings', () => {
      expectActionIssue(
        action,
        baseIssue,
        [' ', '\n', 'foo', 'foobarbaz123'],
        (input) => `${input.length}`
      );
    });

    test('for invalid arrays', () => {
      expectActionIssue(
        action,
        baseIssue,
        [[null], [1, 2, 3, 4, 6], Array(999)],
        (input) => `${input.length}`
      );
    });
  });
});

import { describe, expect, test } from 'vitest';
import type { StringIssue } from '../../schemas/index.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import {
  excludes,
  type ExcludesAction,
  type ExcludesIssue,
} from './excludes.ts';

describe('excludes', () => {
  describe('should return action object', () => {
    const baseAction: Omit<ExcludesAction<string, 'foo', never>, 'message'> = {
      kind: 'validation',
      type: 'excludes',
      reference: excludes,
      expects: `!"foo"`,
      requirement: 'foo',
      async: false,
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const action: ExcludesAction<string, 'foo', undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(excludes('foo')).toStrictEqual(action);
      expect(excludes('foo', undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      const message = 'message';
      expect(excludes('foo', message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies ExcludesAction<string, 'foo', string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(excludes('foo', message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies ExcludesAction<string, 'foo', typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = excludes('foo');

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
      expectNoActionIssue(action, ['', 'fo', 'fobar', '123fo']);
    });

    test('for valid arrays', () => {
      expectNoActionIssue(action, [
        [],
        ['fo'],
        [123, 'fobar'],
        [null, 123, true],
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = excludes('foo', 'message');
    const baseIssue: Omit<
      ExcludesIssue<string, 'foo'>,
      'input' | 'received'
    > = {
      kind: 'validation',
      type: 'excludes',
      expected: `!"foo"`,
      message: 'message',
      requirement: 'foo',
    };

    test('for invalid strings', () => {
      expectActionIssue(
        action,
        baseIssue,
        ['foo', 'foobar', '123foo'],
        () => '"foo"'
      );
    });

    test('for invalid arrays', () => {
      expectActionIssue(
        action,
        baseIssue,
        [['foo'], [123, 'foo'], [null, 123, 'foo', true, 'foo']],
        () => '"foo"'
      );
    });
  });
});

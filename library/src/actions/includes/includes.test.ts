import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import {
  includes,
  type IncludesAction,
  type IncludesIssue,
} from './includes.ts';

describe('includes', () => {
  describe('should return action object', () => {
    const baseAction: Omit<IncludesAction<string, 'foo', never>, 'message'> = {
      kind: 'validation',
      type: 'includes',
      reference: includes,
      expects: '"foo"',
      requirement: 'foo',
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: IncludesAction<string, 'foo', undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(includes('foo')).toStrictEqual(action);
      expect(includes('foo', undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      const message = 'message';
      expect(includes('foo', message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies IncludesAction<string, 'foo', string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(includes('foo', message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies IncludesAction<string, 'foo', typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = includes('foo');

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid strings', () => {
      expectNoActionIssue(action, ['foo', 'foobar', '123foo']);
    });

    test('for valid arrays', () => {
      expectNoActionIssue(action, [
        ['foo'],
        [123, 'foo'],
        [null, 123, 'foo', true, 'foo'],
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = includes('foo', 'message');
    const baseIssue: Omit<
      IncludesIssue<string, 'foo'>,
      'input' | 'received'
    > = {
      kind: 'validation',
      type: 'includes',
      expected: '"foo"',
      message: 'message',
      requirement: 'foo',
    };

    test('for invalid strings', () => {
      expectActionIssue(
        action,
        baseIssue,
        ['', 'fo', 'fobar', '123fo'],
        () => '!"foo"'
      );
    });

    test('for invalid arrays', () => {
      expectActionIssue(
        action,
        baseIssue,
        [[], ['fo'], [123, 'fobar'], [null, 123, true]],
        () => '!"foo"'
      );
    });
  });
});

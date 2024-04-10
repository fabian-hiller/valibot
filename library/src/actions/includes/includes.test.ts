import { describe, expect, test } from 'vitest';
import { 
  includes,
  type IncludesIssue, 
  type IncludesAction 
} from './includes.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';

describe('includes', () => {
  describe('should return action object', () => {
    const baseAction: Omit<IncludesAction<string, 'hello', never>, 'message'> = {
      kind: 'validation',
      type: 'includes',
      expects: `"hello"`,
      requirement: 'hello',
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: IncludesAction<string, 'hello', undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(includes('hello')).toStrictEqual(action);
      expect(includes('hello', undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      const message = 'message';
      expect(includes('hello', message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies IncludesAction<string, 'hello', string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(includes('hello', message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies IncludesAction<string, 'hello', typeof message>);
    });
  });

  describe('should return no issue', () => {
    const action = includes('foobar');

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid strings', () => {
      expectNoActionIssue(action, ['foobar', '123foobar45', '123456foobar', 'foobarbaz123']);
    });

    test('for valid arrays', () => {
      expectNoActionIssue(action, [['123', 'test', 'foobar', '456'], ['test123', 'foobar'], ['foobar'], ['foobar', 'hello']]);
    });
  });

  describe('should return an issue', () => {
    const actionRequirement = 'test123';
    const actionMessage = 'message';
    const action = includes(actionRequirement, actionMessage);
    const baseIssue: Omit<IncludesIssue<string, 'test123'>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'includes',
      expected: `"${actionRequirement}"`,
      message: actionMessage,
      requirement: actionRequirement,
    };

    const issueGetReceived = () => `!"${actionRequirement}"`;

    test('for invalid strings', () => {
      expectActionIssue(
        action,
        baseIssue,
        ['', 'foo', '1234'],
        issueGetReceived
      );
    });

    test('for invalid arrays', () => {
      expectActionIssue(
        action,
        baseIssue,
        [[], ['foo', 'bar'], [1, 2, 3, 4]],
        issueGetReceived
      );
    });
  });
});

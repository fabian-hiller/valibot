import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { some, type SomeAction, type SomeIssue } from './some.ts';

describe('some', () => {
  describe('should return action object', () => {
    const baseAction: Omit<SomeAction<string[], never>, 'message'> = {
      kind: 'validation',
      type: 'some',
      reference: some,
      expects: null,
      requirement: expect.any(Function),
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: SomeAction<string[], undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(some(() => true)).toStrictEqual(action);
      expect(some(() => true, undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      const message = 'message';
      expect(some(() => true, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies SomeAction<string[], string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(some(() => true, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies SomeAction<string[], typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = some<number[]>((element: number) => element > 9);

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid typed inputs', () => {
      expectNoActionIssue(action, [
        [12],
        [3, 12],
        [10, 9],
        [10, 9, 11],
        [12, 21, 11],
      ]);
    });
  });

  describe('should return an issue', () => {
    const requirement = (element: number) => element > 9;
    const action = some<number[], 'message'>(requirement, 'message');
    const baseIssue: Omit<SomeIssue<number[]>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'some',
      expected: null,
      message: 'message',
      requirement,
    };

    test('for invalid typed inputs', () => {
      expectActionIssue(
        action,
        baseIssue,
        [[], [9], [7, 8, 9], [1, 2, 3, 4]],
        () => 'Array'
      );
    });
  });
});

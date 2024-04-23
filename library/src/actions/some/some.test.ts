import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { some, type SomeAction, type SomeIssue } from './some.ts';

describe('some', () => {
  describe('should return action object', () => {
    const requirement = (element: string) => element.startsWith('DE');
    const baseAction: Omit<SomeAction<string[], never>, 'message'> = {
      kind: 'validation',
      type: 'some',
      reference: some,
      expects: null,
      requirement,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: SomeAction<string[], undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(some<string[]>(requirement)).toStrictEqual(action);
      expect(some<string[], undefined>(requirement, undefined)).toStrictEqual(
        action
      );
    });

    test('with string message', () => {
      const message = 'message';
      expect(some<string[], 'message'>(requirement, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies SomeAction<string[], 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(
        some<string[], typeof message>(requirement, message)
      ).toStrictEqual({
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
        [10],
        [-1, 10],
        [10, 11, 12],
        [1, 2, 3, 4, 99, 6],
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

    test('for empty array', () => {
      expectActionIssue(action, baseIssue, [[]]);
    });

    test('for invalid typed inputs', () => {
      expectActionIssue(action, baseIssue, [
        [9],
        [7, 8, 9],
        [-1, 0, 1, 2, 3, 4],
      ]);
    });
  });
});

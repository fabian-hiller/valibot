import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import {
  someItem,
  type SomeItemAction,
  type SomeItemIssue,
} from './someItem.ts';

describe('someItem', () => {
  describe('should return action object', () => {
    const requirement = (item: string) => item.startsWith('DE');
    const baseAction: Omit<SomeItemAction<string[], never>, 'message'> = {
      kind: 'validation',
      type: 'some_item',
      reference: someItem,
      expects: null,
      requirement,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: SomeItemAction<string[], undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(someItem<string[]>(requirement)).toStrictEqual(action);
      expect(
        someItem<string[], undefined>(requirement, undefined)
      ).toStrictEqual(action);
    });

    test('with string message', () => {
      const message = 'message';
      expect(someItem<string[], 'message'>(requirement, message)).toStrictEqual(
        {
          ...baseAction,
          message,
        } satisfies SomeItemAction<string[], 'message'>
      );
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(
        someItem<string[], typeof message>(requirement, message)
      ).toStrictEqual({
        ...baseAction,
        message,
      } satisfies SomeItemAction<string[], typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = someItem<number[]>((item: number) => item > 9);

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

  describe('should return dataset with issues', () => {
    const requirement = (item: number) => item > 9;
    const action = someItem<number[], 'message'>(requirement, 'message');

    const baseIssue: Omit<SomeItemIssue<number[]>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'some_item',
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

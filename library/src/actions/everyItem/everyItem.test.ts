import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import {
  everyItem,
  type EveryItemAction,
  type EveryItemIssue,
} from './everyItem.ts';

describe('everyItem', () => {
  describe('should return action object', () => {
    const requirement = (item: string) => item.startsWith('DE');
    const baseAction: Omit<EveryItemAction<string[], never>, 'message'> = {
      kind: 'validation',
      type: 'every_item',
      reference: everyItem,
      expects: null,
      requirement,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: EveryItemAction<string[], undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(everyItem<string[]>(requirement)).toStrictEqual(action);
      expect(
        everyItem<string[], undefined>(requirement, undefined)
      ).toStrictEqual(action);
    });

    test('with string message', () => {
      const message = 'message';
      expect(
        everyItem<string[], 'message'>(requirement, message)
      ).toStrictEqual({
        ...baseAction,
        message,
      } satisfies EveryItemAction<string[], 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(
        everyItem<string[], typeof message>(requirement, message)
      ).toStrictEqual({
        ...baseAction,
        message,
      } satisfies EveryItemAction<string[], typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = everyItem<number[]>((item: number) => item > 9);

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for empty array', () => {
      expectNoActionIssue(action, [[]]);
    });

    test('for valid content', () => {
      expectNoActionIssue(action, [[10, 11, 12, 13, 99]]);
    });
  });

  describe('should return dataset with issues', () => {
    const requirement = (item: number) => item > 9;
    const action = everyItem<number[], 'message'>(requirement, 'message');

    const baseIssue: Omit<EveryItemIssue<number[]>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'every_item',
      expected: null,
      message: 'message',
      requirement,
    };

    test('for invalid content', () => {
      expectActionIssue(action, baseIssue, [
        [9],
        [1, 2, 3],
        [10, 11, -12, 13, 99],
      ]);
    });
  });
});

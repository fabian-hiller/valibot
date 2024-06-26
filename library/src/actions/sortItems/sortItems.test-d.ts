import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { sortItems, type SortItemsAction } from './sortItems.ts';

describe('sortItems', () => {
  test('should return action object', () => {
    expectTypeOf(
      sortItems<number[]>((itemA, itemB) =>
        itemA > itemB ? 1 : itemA < itemB ? -1 : 0
      )
    ).toEqualTypeOf<SortItemsAction<number[]>>();
  });

  describe('should infer correct types', () => {
    type Input = (string | number)[];
    type Action = SortItemsAction<Input>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<never>();
    });
  });
});

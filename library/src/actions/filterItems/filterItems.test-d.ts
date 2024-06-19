import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { filterItems, type FilterItemsAction } from './filterItems.ts';

describe('filterItems', () => {
  test('should return action object', () => {
    expectTypeOf(filterItems<number[]>((item) => item > 9)).toEqualTypeOf<
      FilterItemsAction<number[]>
    >();
  });

  describe('should infer correct types', () => {
    type Input = (string | number)[];
    type Action = FilterItemsAction<Input>;

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

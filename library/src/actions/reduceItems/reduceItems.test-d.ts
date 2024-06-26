import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { reduceItems, type ReduceItemsAction } from './reduceItems.ts';

describe('reduceItems', () => {
  test('should return action object', () => {
    expectTypeOf(
      reduceItems<number[], number>((output, item) => output + item, 0)
    ).toEqualTypeOf<ReduceItemsAction<number[], number>>();
  });

  describe('should infer correct types', () => {
    type Action = ReduceItemsAction<number[], number>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<number[]>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<number>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<never>();
    });
  });
});

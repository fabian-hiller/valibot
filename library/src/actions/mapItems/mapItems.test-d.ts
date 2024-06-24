import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { mapItems, type MapItemsAction } from './mapItems.ts';

describe('mapItems', () => {
  test('should return action object', () => {
    expectTypeOf(
      mapItems<number[], { item: number }>((item) => ({ item }))
    ).toEqualTypeOf<MapItemsAction<number[], { item: number }>>();
  });

  describe('should infer correct types', () => {
    type Action = MapItemsAction<number[], { item: number }>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<number[]>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<{ item: number }[]>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<never>();
    });
  });
});

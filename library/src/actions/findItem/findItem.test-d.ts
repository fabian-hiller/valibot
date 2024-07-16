import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { findItem, type FindItemAction } from './findItem.ts';

describe('findItem', () => {
  test('should return action object', () => {
    expectTypeOf(findItem<number[]>((item) => item > 9)).toEqualTypeOf<
      FindItemAction<number[]>
    >();
  });

  describe('should infer correct types', () => {
    type Input = (string | number)[];
    type Action = FindItemAction<Input>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<
        string | number | undefined
      >();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<never>();
    });
  });
});

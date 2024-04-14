import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/infer.ts';
import { toMaxValue, type ToMaxValueAction } from './toMaxValue.ts';

describe('toMaxValue', () => {
  test('should return action object', () => {
    expectTypeOf(toMaxValue<number, 10>(10)).toEqualTypeOf<
      ToMaxValueAction<number, 10>
    >();
  });

  describe('should infer correct types', () => {
    type Action = ToMaxValueAction<number, 10>;
    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<number>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<number>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<never>();
    });
  });
});

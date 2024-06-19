import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/infer.ts';
import { toMinValue, type ToMinValueAction } from './toMinValue.ts';

describe('toMinValue', () => {
  test('should return action object', () => {
    expectTypeOf(toMinValue<number, 10>(10)).toEqualTypeOf<
      ToMinValueAction<number, 10>
    >();
  });

  describe('should infer correct types', () => {
    type Action = ToMinValueAction<number, 10>;

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

import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  minValue,
  type MinValueAction,
  type MinValueIssue,
} from './minValue.ts';

describe('minValue', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = MinValueAction<number, 10, undefined>;
      expectTypeOf(minValue<number, 10>(10)).toEqualTypeOf<Action>();
      expectTypeOf(
        minValue<number, 10, undefined>(10, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        minValue<number, 10, 'message'>(10, 'message')
      ).toEqualTypeOf<MinValueAction<number, 10, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        minValue<number, 10, () => string>(10, () => 'message')
      ).toEqualTypeOf<MinValueAction<number, 10, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = MinValueAction<number, 10, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<number>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<number>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        MinValueIssue<number, 10>
      >();
    });
  });
});

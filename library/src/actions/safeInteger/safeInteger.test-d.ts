import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  safeInteger,
  type SafeIntegerAction,
  type SafeIntegerIssue,
} from './safeInteger.ts';

describe('safeInteger', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = SafeIntegerAction<number, undefined>;
      expectTypeOf(safeInteger()).toEqualTypeOf<Action>();
      expectTypeOf(safeInteger(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(safeInteger('message')).toEqualTypeOf<
        SafeIntegerAction<number, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(safeInteger(() => 'message')).toEqualTypeOf<
        SafeIntegerAction<number, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = SafeIntegerAction<number, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<number>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<number>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        SafeIntegerIssue<number>
      >();
    });
  });
});

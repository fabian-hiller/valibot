import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  minLength,
  type MinLengthAction,
  type MinLengthIssue,
} from './minLength.ts';

describe('minLength', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = MinLengthAction<string, 10, undefined>;
      expectTypeOf(minLength<string, 10>(10)).toEqualTypeOf<Action>();
      expectTypeOf(
        minLength<string, 10, undefined>(10, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        minLength<string, 10, 'message'>(10, 'message')
      ).toEqualTypeOf<MinLengthAction<string, 10, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        minLength<string, 10, () => string>(10, () => 'message')
      ).toEqualTypeOf<MinLengthAction<string, 10, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = MinLengthAction<string, 10, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        MinLengthIssue<string, 10>
      >();
    });
  });
});

import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  maxLength,
  type MaxLengthAction,
  type MaxLengthIssue,
} from './maxLength.ts';

describe('maxLength', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = MaxLengthAction<string, 10, undefined>;
      expectTypeOf(maxLength<string, 10>(10)).toEqualTypeOf<Action>();
      expectTypeOf(
        maxLength<string, 10, undefined>(10, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        maxLength<string, 10, 'message'>(10, 'message')
      ).toEqualTypeOf<MaxLengthAction<string, 10, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        maxLength<string, 10, () => string>(10, () => 'message')
      ).toEqualTypeOf<MaxLengthAction<string, 10, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = MaxLengthAction<string, 10, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        MaxLengthIssue<string, 10>
      >();
    });
  });
});

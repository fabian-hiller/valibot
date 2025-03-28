import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  minDigits,
  type MinDigitsAction,
  type MinDigitsIssue,
} from './minDigits.ts';

describe('minDigits', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = MinDigitsAction<string, 10, undefined>;
      expectTypeOf(minDigits<string, 10>(10)).toEqualTypeOf<Action>();
      expectTypeOf(
        minDigits<string, 10, undefined>(10, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        minDigits<string, 10, 'message'>(10, 'message')
      ).toEqualTypeOf<MinDigitsAction<string, 10, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        minDigits<string, 10, () => string>(10, () => 'message')
      ).toEqualTypeOf<MinDigitsAction<string, 10, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Input = 'example string';
    type Action = MinDigitsAction<Input, 10, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        MinDigitsIssue<Input, 10>
      >();
    });
  });
});

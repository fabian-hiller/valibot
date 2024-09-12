import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { digits, type DigitsAction, type DigitsIssue } from './digits.ts';

describe('digits', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = DigitsAction<string, undefined>;
      expectTypeOf(digits()).toEqualTypeOf<Action>();
      expectTypeOf(digits(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(digits('message')).toEqualTypeOf<
        DigitsAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(digits(() => 'message')).toEqualTypeOf<
        DigitsAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = DigitsAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<DigitsIssue<string>>();
    });
  });
});

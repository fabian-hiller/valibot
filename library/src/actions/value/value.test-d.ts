import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { value, type ValueAction, type ValueIssue } from './value.ts';

describe('value', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = ValueAction<number, 10, undefined>;
      expectTypeOf(value<number, 10>(10)).toEqualTypeOf<Action>();
      expectTypeOf(
        value<number, 10, undefined>(10, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(value<number, 10, 'message'>(10, 'message')).toEqualTypeOf<
        ValueAction<number, 10, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        value<number, 10, () => string>(10, () => 'message')
      ).toEqualTypeOf<ValueAction<number, 10, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = ValueAction<number, 10, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<number>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<number>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        ValueIssue<number, 10>
      >();
    });
  });
});

import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { length, type LengthAction, type LengthIssue } from './length.ts';

describe('length', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = LengthAction<string, 10, undefined>;
      expectTypeOf(length<string, 10>(10)).toEqualTypeOf<Action>();
      expectTypeOf(
        length<string, 10, undefined>(10, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(length<string, 10, 'message'>(10, 'message')).toEqualTypeOf<
        LengthAction<string, 10, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        length<string, 10, () => string>(10, () => 'message')
      ).toEqualTypeOf<LengthAction<string, 10, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Input = [1, 'two', { value: 'three' }];
    type Action = LengthAction<Input, 3, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<LengthIssue<Input, 3>>();
    });
  });
});

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
    type Action = LengthAction<[1, 'two', { value: 'three' }], 3, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<
        [1, 'two', { value: 'three' }]
      >();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<
        [1, 'two', { value: 'three' }]
      >();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        LengthIssue<[1, 'two', { value: 'three' }], 3>
      >();
    });
  });
});

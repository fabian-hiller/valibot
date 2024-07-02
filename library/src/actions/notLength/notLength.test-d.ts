import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  notLength,
  type NotLengthAction,
  type NotLengthIssue,
} from './notLength.ts';

describe('notLength', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = NotLengthAction<string, 10, undefined>;
      expectTypeOf(notLength<string, 10>(10)).toEqualTypeOf<Action>();
      expectTypeOf(
        notLength<string, 10, undefined>(10, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        notLength<string, 10, 'message'>(10, 'message')
      ).toEqualTypeOf<NotLengthAction<string, 10, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        notLength<string, 10, () => string>(10, () => 'message')
      ).toEqualTypeOf<NotLengthAction<string, 10, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Input = [1, 'two', { value: 'three' }];
    type Action = NotLengthAction<Input, 3, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        NotLengthIssue<Input, 3>
      >();
    });
  });
});

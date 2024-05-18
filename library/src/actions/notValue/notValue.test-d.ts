import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { notValue, type NotValueAction, type NotValueIssue } from './notValue.ts';

describe('value', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = NotValueAction<number, 10, undefined>;
      expectTypeOf(notValue<number, 10>(10)).toEqualTypeOf<Action>();
      expectTypeOf(
        notValue<number, 10, undefined>(10, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(notValue<number, 10, 'message'>(10, 'message')).toEqualTypeOf<
        NotValueAction<number, 10, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        notValue<number, 10, () => string>(10, () => 'message')
      ).toEqualTypeOf<NotValueAction<number, 10, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = NotValueAction<number, 10, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<number>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<number>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
      NotValueIssue<number, 10>
      >();
    });
  });
});

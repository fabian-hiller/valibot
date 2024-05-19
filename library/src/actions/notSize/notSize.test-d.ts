import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { notSize, type NotSizeAction, type NotSizeIssue } from './notSize.ts';

describe('notSize', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = NotSizeAction<Blob, 10, undefined>;
      expectTypeOf(notSize<Blob, 10>(10)).toEqualTypeOf<Action>();
      expectTypeOf(
        notSize<Blob, 10, undefined>(10, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(notSize<Blob, 10, 'message'>(10, 'message')).toEqualTypeOf<
        NotSizeAction<Blob, 10, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        notSize<Blob, 10, () => string>(10, () => 'message')
      ).toEqualTypeOf<NotSizeAction<Blob, 10, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = NotSizeAction<Map<string, number>, 10, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Map<string, number>>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Map<string, number>>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        NotSizeIssue<Map<string, number>, 10>
      >();
    });
  });
});

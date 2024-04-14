import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { maxSize, type MaxSizeAction, type MaxSizeIssue } from './maxSize.ts';

describe('maxSize', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = MaxSizeAction<Blob, 10, undefined>;
      expectTypeOf(maxSize<Blob, 10>(10)).toEqualTypeOf<Action>();
      expectTypeOf(
        maxSize<Blob, 10, undefined>(10, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(maxSize<Blob, 10, 'message'>(10, 'message')).toEqualTypeOf<
        MaxSizeAction<Blob, 10, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        maxSize<Blob, 10, () => string>(10, () => 'message')
      ).toEqualTypeOf<MaxSizeAction<Blob, 10, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = MaxSizeAction<Map<string, number>, 10, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Map<string, number>>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Map<string, number>>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        MaxSizeIssue<Map<string, number>, 10>
      >();
    });
  });
});

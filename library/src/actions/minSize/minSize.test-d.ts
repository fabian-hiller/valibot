import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { minSize, type MinSizeAction, type MinSizeIssue } from './minSize.ts';

describe('minSize', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = MinSizeAction<Blob, 10, undefined>;
      expectTypeOf(minSize<Blob, 10>(10)).toEqualTypeOf<Action>();
      expectTypeOf(
        minSize<Blob, 10, undefined>(10, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(minSize<Blob, 10, 'message'>(10, 'message')).toEqualTypeOf<
        MinSizeAction<Blob, 10, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        minSize<Blob, 10, () => string>(10, () => 'message')
      ).toEqualTypeOf<MinSizeAction<Blob, 10, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = MinSizeAction<Map<string, number>, 10, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Map<string, number>>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Map<string, number>>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        MinSizeIssue<Map<string, number>, 10>
      >();
    });
  });
});

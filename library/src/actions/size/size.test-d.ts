import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { size, type SizeAction, type SizeIssue } from './size.ts';

describe('size', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = SizeAction<Blob, 10, undefined>;
      expectTypeOf(size<Blob, 10>(10)).toEqualTypeOf<Action>();
      expectTypeOf(
        size<Blob, 10, undefined>(10, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(size<Blob, 10, 'message'>(10, 'message')).toEqualTypeOf<
        SizeAction<Blob, 10, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        size<Blob, 10, () => string>(10, () => 'message')
      ).toEqualTypeOf<SizeAction<Blob, 10, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = SizeAction<Map<string, number>, 10, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Map<string, number>>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Map<string, number>>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        SizeIssue<Map<string, number>, 10>
      >();
    });
  });
});

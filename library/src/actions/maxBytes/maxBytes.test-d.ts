import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  maxBytes,
  type MaxBytesAction,
  type MaxBytesIssue,
} from './maxBytes.ts';

describe('maxBytes', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = MaxBytesAction<string, 10, undefined>;
      expectTypeOf(maxBytes<string, 10>(10)).toEqualTypeOf<Action>();
      expectTypeOf(
        maxBytes<string, 10, undefined>(10, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        maxBytes<string, 10, 'message'>(10, 'message')
      ).toEqualTypeOf<MaxBytesAction<string, 10, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        maxBytes<string, 10, () => string>(10, () => 'message')
      ).toEqualTypeOf<MaxBytesAction<string, 10, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = MaxBytesAction<string, 10, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        MaxBytesIssue<string, 10>
      >();
    });
  });
});

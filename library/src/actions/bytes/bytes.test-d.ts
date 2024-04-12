import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  bytes,
  type BytesAction,
  type BytesIssue,
} from './bytes.ts';

describe('bytes', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = BytesAction<string, 10, undefined>;
      expectTypeOf(bytes<string, 10>(10)).toEqualTypeOf<Action>();
      expectTypeOf(
        bytes<string, 10, undefined>(10, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        bytes<string, 10, 'message'>(10, 'message')
      ).toEqualTypeOf<BytesAction<string, 10, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        bytes<string, 10, () => string>(10, () => 'message')
      ).toEqualTypeOf<BytesAction<string, 10, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = BytesAction<string, 10, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        BytesIssue<string, 10>
      >();
    });
  });
});

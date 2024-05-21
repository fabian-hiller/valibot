import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  minBytes,
  type MinBytesAction,
  type MinBytesIssue,
} from './minBytes.ts';

describe('minBytes', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = MinBytesAction<string, 10, undefined>;
      expectTypeOf(minBytes<string, 10>(10)).toEqualTypeOf<Action>();
      expectTypeOf(
        minBytes<string, 10, undefined>(10, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        minBytes<string, 10, 'message'>(10, 'message')
      ).toEqualTypeOf<MinBytesAction<string, 10, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        minBytes<string, 10, () => string>(10, () => 'message')
      ).toEqualTypeOf<MinBytesAction<string, 10, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = MinBytesAction<string, 10, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        MinBytesIssue<string, 10>
      >();
    });
  });
});

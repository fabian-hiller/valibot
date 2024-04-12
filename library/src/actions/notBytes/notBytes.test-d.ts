import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  notBytes,
  type NotBytesAction,
  type NotBytesIssue,
} from './notBytes.ts';

describe('notBytes', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = NotBytesAction<string, 10, undefined>;
      expectTypeOf(notBytes<string, 10>(10)).toEqualTypeOf<Action>();
      expectTypeOf(
        notBytes<string, 10, undefined>(10, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        notBytes<string, 10, 'message'>(10, 'message')
      ).toEqualTypeOf<NotBytesAction<string, 10, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        notBytes<string, 10, () => string>(10, () => 'message')
      ).toEqualTypeOf<NotBytesAction<string, 10, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = NotBytesAction<string, 10, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        NotBytesIssue<string, 10>
      >();
    });
  });
});

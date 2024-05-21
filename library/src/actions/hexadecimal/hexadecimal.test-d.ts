import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  hexadecimal,
  type HexadecimalAction,
  type HexadecimalIssue,
} from './hexadecimal.ts';

describe('hexadecimal', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = HexadecimalAction<string, undefined>;
      expectTypeOf(hexadecimal()).toEqualTypeOf<Action>();
      expectTypeOf(hexadecimal(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(hexadecimal('message')).toEqualTypeOf<
        HexadecimalAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(hexadecimal(() => 'message')).toEqualTypeOf<
        HexadecimalAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = HexadecimalAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        HexadecimalIssue<string>
      >();
    });
  });
});

import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  base64url,
  type Base64urlAction,
  type Base64urlIssue,
} from './base64url.ts';

describe('base64url', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = Base64urlAction<string, undefined>;
      expectTypeOf(base64url<string>()).toEqualTypeOf<Action>();
      expectTypeOf(
        base64url<string, undefined>(undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(base64url<string, 'message'>('message')).toEqualTypeOf<
        Base64urlAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        base64url<string, () => string>(() => 'message')
      ).toEqualTypeOf<Base64urlAction<string, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = Base64urlAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        Base64urlIssue<string>
      >();
    });
  });
});

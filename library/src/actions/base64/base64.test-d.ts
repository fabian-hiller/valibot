import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { base64, type Base64Action, type Base64Issue } from './base64.ts';

describe('base64', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = Base64Action<string, undefined>;
      expectTypeOf(base64<string>()).toEqualTypeOf<Action>();
      expectTypeOf(
        base64<string, undefined>(undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(base64<string, 'message'>('message')).toEqualTypeOf<
        Base64Action<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(base64<string, () => string>(() => 'message')).toEqualTypeOf<
        Base64Action<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = Base64Action<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<Base64Issue<string>>();
    });
  });
});

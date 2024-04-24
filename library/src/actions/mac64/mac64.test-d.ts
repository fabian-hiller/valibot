import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { mac64, type Mac64Action, type Mac64Issue } from './mac64.ts';

describe('mac64', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = Mac64Action<string, undefined>;
      expectTypeOf(mac64<string>()).toEqualTypeOf<Action>();
      expectTypeOf(mac64<string, undefined>(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(mac64<string, 'message'>('message')).toEqualTypeOf<
        Mac64Action<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(mac64<string, () => string>(() => 'message')).toEqualTypeOf<
        Mac64Action<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = Mac64Action<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<Mac64Issue<string>>();
    });
  });
});

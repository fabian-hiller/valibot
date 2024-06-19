import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { mac48, type Mac48Action, type Mac48Issue } from './mac48.ts';

describe('mac48', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = Mac48Action<string, undefined>;
      expectTypeOf(mac48<string>()).toEqualTypeOf<Action>();
      expectTypeOf(mac48<string, undefined>(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(mac48<string, 'message'>('message')).toEqualTypeOf<
        Mac48Action<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(mac48<string, () => string>(() => 'message')).toEqualTypeOf<
        Mac48Action<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = Mac48Action<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<Mac48Issue<string>>();
    });
  });
});

import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { mac, type MacAction, type MacIssue } from './mac.ts';

describe('mac', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = MacAction<string, undefined>;
      expectTypeOf(mac<string>()).toEqualTypeOf<Action>();
      expectTypeOf(mac<string, undefined>(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(mac<string, 'message'>('message')).toEqualTypeOf<
        MacAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(mac<string, () => string>(() => 'message')).toEqualTypeOf<
        MacAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = MacAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<MacIssue<string>>();
    });
  });
});

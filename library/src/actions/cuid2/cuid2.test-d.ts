import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { cuid2, type Cuid2Action, type Cuid2Issue } from './cuid2.ts';

describe('cuid2', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = Cuid2Action<string, undefined>;
      expectTypeOf(cuid2<string>()).toEqualTypeOf<Action>();
      expectTypeOf(cuid2<string, undefined>(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(cuid2<string, 'message'>('message')).toEqualTypeOf<
        Cuid2Action<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(cuid2<string, () => string>(() => 'message')).toEqualTypeOf<
        Cuid2Action<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = Cuid2Action<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<Cuid2Issue<string>>();
    });
  });
});

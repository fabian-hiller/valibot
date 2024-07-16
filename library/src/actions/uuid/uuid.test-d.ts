import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { uuid, type UuidAction, type UuidIssue } from './uuid.ts';

describe('uuid', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = UuidAction<string, undefined>;
      expectTypeOf(uuid<string>()).toEqualTypeOf<Action>();
      expectTypeOf(uuid<string, undefined>(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(uuid<string, 'message'>('message')).toEqualTypeOf<
        UuidAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(uuid<string, () => string>(() => 'message')).toEqualTypeOf<
        UuidAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = UuidAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<UuidIssue<string>>();
    });
  });
});

import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { ulid, type UlidAction, type UlidIssue } from './ulid.ts';

describe('ulid', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = UlidAction<string, undefined>;
      expectTypeOf(ulid<string>()).toEqualTypeOf<Action>();
      expectTypeOf(ulid<string, undefined>(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(ulid<string, 'message'>('message')).toEqualTypeOf<
        UlidAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(ulid<string, () => string>(() => 'message')).toEqualTypeOf<
        UlidAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = UlidAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<UlidIssue<string>>();
    });
  });
});

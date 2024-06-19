import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { empty, type EmptyAction, type EmptyIssue } from './empty.ts';

describe('empty', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = EmptyAction<string, undefined>;
      expectTypeOf(empty<string>()).toEqualTypeOf<Action>();
      expectTypeOf(empty<string, undefined>(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(empty<string, 'message'>('message')).toEqualTypeOf<
        EmptyAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(empty<string, () => string>(() => 'message')).toEqualTypeOf<
        EmptyAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = EmptyAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<EmptyIssue<string>>();
    });
  });
});

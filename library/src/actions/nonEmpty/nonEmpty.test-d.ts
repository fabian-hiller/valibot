import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  nonEmpty,
  type NonEmptyAction,
  type NonEmptyIssue,
} from './nonEmpty.ts';

describe('nonEmpty', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = NonEmptyAction<string, undefined>;
      expectTypeOf(nonEmpty<string>()).toEqualTypeOf<Action>();
      expectTypeOf(
        nonEmpty<string, undefined>(undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(nonEmpty<string, 'message'>('message')).toEqualTypeOf<
        NonEmptyAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        nonEmpty<string, () => string>(() => 'message')
      ).toEqualTypeOf<NonEmptyAction<string, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = NonEmptyAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<NonEmptyIssue<string>>();
    });
  });
});

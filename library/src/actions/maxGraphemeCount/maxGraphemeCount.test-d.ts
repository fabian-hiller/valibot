import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  maxGraphemeCount,
  type MaxGraphemeCountAction,
  type MaxGraphemeCountIssue,
} from './maxGraphemeCount.ts';

describe('maxGraphemeCount', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = MaxGraphemeCountAction<string, 10, undefined>;
      expectTypeOf(maxGraphemeCount<string, 10>(10)).toEqualTypeOf<Action>();
      expectTypeOf(
        maxGraphemeCount<string, 10, undefined>(10, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        maxGraphemeCount<string, 10, 'message'>(10, 'message')
      ).toEqualTypeOf<MaxGraphemeCountAction<string, 10, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        maxGraphemeCount<string, 10, () => string>(10, () => 'message')
      ).toEqualTypeOf<MaxGraphemeCountAction<string, 10, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = MaxGraphemeCountAction<string, 10, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        MaxGraphemeCountIssue<string, 10>
      >();
    });
  });
});

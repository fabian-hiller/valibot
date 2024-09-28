import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  minGraphemeCount,
  type MinGraphemeCountAction,
  type MinGraphemeCountIssue,
} from './minGraphemeCount.ts';

describe('minGraphemeCount', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = MinGraphemeCountAction<string, 10, undefined>;
      expectTypeOf(minGraphemeCount<string, 10>(10)).toEqualTypeOf<Action>();
      expectTypeOf(
        minGraphemeCount<string, 10, undefined>(10, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        minGraphemeCount<string, 10, 'message'>(10, 'message')
      ).toEqualTypeOf<MinGraphemeCountAction<string, 10, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        minGraphemeCount<string, 10, () => string>(10, () => 'message')
      ).toEqualTypeOf<MinGraphemeCountAction<string, 10, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = MinGraphemeCountAction<string, 10, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        MinGraphemeCountIssue<string, 10>
      >();
    });
  });
});

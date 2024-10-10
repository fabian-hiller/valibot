import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  uniqueItems,
  type UniqueItemsAction,
  type UniqueItemsIssue,
} from './uniqueItems.ts';

describe('uniqueItems', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = UniqueItemsAction<unknown[], undefined>;
      expectTypeOf(uniqueItems<unknown[]>()).toEqualTypeOf<Action>();
      expectTypeOf(
        uniqueItems<unknown[], undefined>(undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(uniqueItems<unknown[], 'message'>('message')).toEqualTypeOf<
        UniqueItemsAction<unknown[], 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        uniqueItems<unknown[], () => string>(() => 'message')
      ).toEqualTypeOf<UniqueItemsAction<unknown[], () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Input = [1, 'two', { value: 'three' }];
    type Action = UniqueItemsAction<Input, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        UniqueItemsIssue<Input>
      >();
    });
  });
});

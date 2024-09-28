import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  type CheckItemsActionAsync,
  checkItemsAsync,
} from './checkItemsAsync.ts';
import type { CheckItemsIssue } from './types.ts';

describe('checkItemsAsync', () => {
  describe('should return action object', () => {
    const requirement = async (item: string) => Boolean(item);

    test('with undefined message', () => {
      type Action = CheckItemsActionAsync<string[], undefined>;
      expectTypeOf(
        checkItemsAsync<string[]>(requirement)
      ).toEqualTypeOf<Action>();
      expectTypeOf(
        checkItemsAsync<string[], undefined>(requirement, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        checkItemsAsync<string[], 'message'>(requirement, 'message')
      ).toEqualTypeOf<CheckItemsActionAsync<string[], 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        checkItemsAsync<string[], () => string>(requirement, () => 'message')
      ).toEqualTypeOf<CheckItemsActionAsync<string[], () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Input = ['foo', 123, true];
    type Action = CheckItemsActionAsync<Input, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        CheckItemsIssue<Input>
      >();
    });
  });
});

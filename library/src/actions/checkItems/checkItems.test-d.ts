import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { checkItems, type CheckItemsAction } from './checkItems.ts';
import type { CheckItemsIssue } from './types.ts';

describe('checkItems', () => {
  describe('should return action object', () => {
    const requirement = (item: string) => Boolean(item);

    test('with undefined message', () => {
      type Action = CheckItemsAction<string[], undefined>;
      expectTypeOf(checkItems<string[]>(requirement)).toEqualTypeOf<Action>();
      expectTypeOf(
        checkItems<string[], undefined>(requirement, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        checkItems<string[], 'message'>(requirement, 'message')
      ).toEqualTypeOf<CheckItemsAction<string[], 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        checkItems<string[], () => string>(requirement, () => 'message')
      ).toEqualTypeOf<CheckItemsAction<string[], () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Input = ['foo', 123, true];
    type Action = CheckItemsAction<Input, undefined>;

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

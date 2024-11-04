/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { findItem, type FindItemAction } from './findItem.ts';

describe('findItem', () => {
  type Dog = { type: 'dog' };
  type Cat = { type: 'cat' };
  type Animal = Dog | Cat;
  type Input = Animal[];

  type Action1 = FindItemAction<Input, Animal>;
  type Action2 = FindItemAction<Input, Dog>;

  test('should return action object', () => {
    expectTypeOf(
      findItem<Input, Animal>((item): boolean => item.type === 'dog')
    ).toEqualTypeOf<Action1>();
    expectTypeOf(
      findItem<Input, Dog>((item): item is Dog => item.type === 'dog')
    ).toEqualTypeOf<Action2>();
  });

  describe('should infer correct types', () => {
    test('of input', () => {
      expectTypeOf<InferInput<Action1>>().toEqualTypeOf<Input>();
      expectTypeOf<InferInput<Action2>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action1>>().toEqualTypeOf<Animal | undefined>();
      expectTypeOf<InferOutput<Action2>>().toEqualTypeOf<Dog | undefined>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action1>>().toEqualTypeOf<never>();
      expectTypeOf<InferIssue<Action2>>().toEqualTypeOf<never>();
    });
  });
});

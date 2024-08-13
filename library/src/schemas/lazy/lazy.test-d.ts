import { describe, expectTypeOf, test } from 'vitest';
import type {
  GenericSchema,
  InferInput,
  InferIssue,
  InferOutput,
} from '../../types/index.ts';
import { object } from '../object/object.ts';
import { optional } from '../optional/optional.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import { lazy, type LazySchema } from './lazy.ts';

describe('lazy', () => {
  test('should return schema object', () => {
    expectTypeOf(lazy(() => string())).toEqualTypeOf<
      LazySchema<StringSchema<undefined>>
    >();
  });

  describe('should infer correct types', () => {
    type Schema = LazySchema<StringSchema<undefined>>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<StringIssue>();
    });
  });

  test('should handle recursion', () => {
    interface BinaryTree {
      element: string;
      left?: BinaryTree;
      right?: BinaryTree;
    }

    const BinaryTreeSchema: GenericSchema<BinaryTree> = object({
      element: string(),
      left: optional(lazy(() => BinaryTreeSchema)),
      right: optional(lazy(() => BinaryTreeSchema)),
    });

    expectTypeOf<
      NonNullable<
        NonNullable<InferInput<typeof BinaryTreeSchema>['left']>['right']
      >
    >().toEqualTypeOf<BinaryTree>();
  });
});

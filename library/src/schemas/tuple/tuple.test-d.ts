import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { boolean } from '../boolean/index.ts';
import {
  number,
  type NumberIssue,
  type NumberSchema,
} from '../number/index.ts';
import type { OptionalSchema } from '../optional/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import { tuple, type TupleSchema } from './tuple.ts';
import type { TupleIssue } from './types.ts';

describe('tuple', () => {
  describe('should return schema object', () => {
    const items = [string(), number(), boolean()] as const;
    type Items = typeof items;

    test('with undefined message', () => {
      type Schema = TupleSchema<Items, undefined>;
      expectTypeOf(tuple(items)).toEqualTypeOf<Schema>();
      expectTypeOf(tuple(items, undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(tuple(items, 'message')).toEqualTypeOf<
        TupleSchema<Items, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(tuple(items, () => 'message')).toEqualTypeOf<
        TupleSchema<Items, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = TupleSchema<
      [OptionalSchema<StringSchema<undefined>, 'foo'>, NumberSchema<undefined>],
      undefined
    >;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<
        [string | undefined, number]
      >();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<[string, number]>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
        TupleIssue | StringIssue | NumberIssue
      >();
    });
  });
});

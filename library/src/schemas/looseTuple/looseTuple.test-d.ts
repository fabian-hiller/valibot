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
import { looseTuple, type LooseTupleSchema } from './looseTuple.ts';
import type { LooseTupleIssue } from './types.ts';

describe('looseTuple', () => {
  describe('should return schema object', () => {
    const items = [string(), number(), boolean()] as const;
    type Items = typeof items;

    test('with undefined message', () => {
      type Schema = LooseTupleSchema<Items, undefined>;
      expectTypeOf(looseTuple(items)).toEqualTypeOf<Schema>();
      expectTypeOf(looseTuple(items, undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(looseTuple(items, 'message')).toEqualTypeOf<
        LooseTupleSchema<Items, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(looseTuple(items, () => 'message')).toEqualTypeOf<
        LooseTupleSchema<Items, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = LooseTupleSchema<
      [OptionalSchema<StringSchema<undefined>, 'foo'>, NumberSchema<undefined>],
      undefined
    >;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<
        [string | undefined, number, ...unknown[]]
      >();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<
        [string, number, ...unknown[]]
      >();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
        LooseTupleIssue | StringIssue | NumberIssue
      >();
    });
  });
});

import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  boolean,
  type BooleanIssue,
  type BooleanSchema,
} from '../boolean/index.ts';
import { null_ } from '../null/index.ts';
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
import { tupleWithRest, type TupleWithRestSchema } from './tupleWithRest.ts';
import type { TupleWithRestIssue } from './types.ts';

describe('tupleWithRest', () => {
  describe('should return schema object', () => {
    const items = [string(), number(), boolean()] as const;
    type Items = typeof items;
    const rest = null_();
    type Rest = typeof rest;

    test('with undefined message', () => {
      type Schema = TupleWithRestSchema<Items, Rest, undefined>;
      expectTypeOf(tupleWithRest(items, rest)).toEqualTypeOf<Schema>();
      expectTypeOf(
        tupleWithRest(items, rest, undefined)
      ).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(tupleWithRest(items, rest, 'message')).toEqualTypeOf<
        TupleWithRestSchema<Items, Rest, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(tupleWithRest(items, rest, () => 'message')).toEqualTypeOf<
        TupleWithRestSchema<Items, Rest, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = TupleWithRestSchema<
      [OptionalSchema<StringSchema<undefined>, 'foo'>, NumberSchema<undefined>],
      OptionalSchema<BooleanSchema<undefined>, false>,
      undefined
    >;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<
        [string | undefined, number, ...(boolean | undefined)[]]
      >();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<
        [string, number, ...boolean[]]
      >();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
        TupleWithRestIssue | StringIssue | NumberIssue | BooleanIssue
      >();
    });
  });
});

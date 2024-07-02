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
import {
  tupleWithRestAsync,
  type TupleWithRestSchemaAsync,
} from './tupleWithRestAsync.ts';
import type { TupleWithRestIssue } from './types.ts';

describe('tupleWithRestAsync', () => {
  describe('should return schema object', () => {
    const items = [string(), number(), boolean()] as const;
    type Items = typeof items;
    const rest = null_();
    type Rest = typeof rest;

    test('with undefined message', () => {
      type Schema = TupleWithRestSchemaAsync<Items, Rest, undefined>;
      expectTypeOf(tupleWithRestAsync(items, rest)).toEqualTypeOf<Schema>();
      expectTypeOf(
        tupleWithRestAsync(items, rest, undefined)
      ).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(tupleWithRestAsync(items, rest, 'message')).toEqualTypeOf<
        TupleWithRestSchemaAsync<Items, Rest, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        tupleWithRestAsync(items, rest, () => 'message')
      ).toEqualTypeOf<TupleWithRestSchemaAsync<Items, Rest, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Schema = TupleWithRestSchemaAsync<
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

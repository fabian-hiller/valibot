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
import { strictTuple, type StrictTupleSchema } from './strictTuple.ts';
import type { StrictTupleIssue } from './types.ts';

describe('strictTuple', () => {
  describe('should return schema object', () => {
    const items = [string(), number(), boolean()] as const;
    type Items = typeof items;

    test('with undefined message', () => {
      type Schema = StrictTupleSchema<Items, undefined>;
      expectTypeOf(strictTuple(items)).toEqualTypeOf<Schema>();
      expectTypeOf(strictTuple(items, undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(strictTuple(items, 'message')).toEqualTypeOf<
        StrictTupleSchema<Items, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(strictTuple(items, () => 'message')).toEqualTypeOf<
        StrictTupleSchema<Items, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = StrictTupleSchema<
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
        StrictTupleIssue | StringIssue | NumberIssue
      >();
    });
  });
});

import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { nullish, type NullishSchema } from '../nullish/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import { nonNullable, type NonNullableSchema } from './nonNullable.ts';
import type { NonNullableIssue } from './types.ts';

describe('nonNullable', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = NonNullableSchema<
        NullishSchema<StringSchema<undefined>, undefined>,
        undefined
      >;
      expectTypeOf(nonNullable(nullish(string()))).toEqualTypeOf<Schema>();
      expectTypeOf(
        nonNullable(nullish(string()), undefined)
      ).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(nonNullable(nullish(string()), 'message')).toEqualTypeOf<
        NonNullableSchema<
          NullishSchema<StringSchema<undefined>, undefined>,
          'message'
        >
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        nonNullable(nullish(string()), () => 'message')
      ).toEqualTypeOf<
        NonNullableSchema<
          NullishSchema<StringSchema<undefined>, undefined>,
          () => string
        >
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = NonNullableSchema<
      NullishSchema<StringSchema<undefined>, undefined>,
      undefined
    >;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<string | undefined>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<string | undefined>();
    });

    // TODO: Add test with union schema to make sure `NullIssue` is not
    // included
    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
        NonNullableIssue | StringIssue
      >();
    });
  });
});

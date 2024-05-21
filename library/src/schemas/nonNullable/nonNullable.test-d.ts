import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import type { NullSchema } from '../null/index.ts';
import { nullish, type NullishSchema } from '../nullish/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import type {
  UndefinedIssue,
  UndefinedSchema,
} from '../undefined/undefined.ts';
import type { UnionIssue, UnionSchema } from '../union/index.ts';
import { nonNullable, type NonNullableSchema } from './nonNullable.ts';
import type { NonNullableIssue } from './types.ts';

describe('nonNullable', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = NonNullableSchema<
        NullishSchema<StringSchema<undefined>, never>,
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
          NullishSchema<StringSchema<undefined>, never>,
          'message'
        >
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        nonNullable(nullish(string()), () => 'message')
      ).toEqualTypeOf<
        NonNullableSchema<
          NullishSchema<StringSchema<undefined>, never>,
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

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
        NonNullableIssue | StringIssue
      >();
      expectTypeOf<
        InferIssue<
          NonNullableSchema<
            UnionSchema<
              [
                StringSchema<undefined>,
                NullSchema<undefined>,
                UndefinedSchema<undefined>,
              ],
              undefined
            >,
            undefined
          >
        >
      >().toEqualTypeOf<
        | NonNullableIssue
        | StringIssue
        | UndefinedIssue
        | UnionIssue<StringIssue | UndefinedIssue>
      >();
    });
  });
});

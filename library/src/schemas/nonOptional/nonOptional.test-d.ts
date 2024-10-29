import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import type { NullIssue, NullSchema } from '../null/index.ts';
import { nullish, type NullishSchema } from '../nullish/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import type { UndefinedSchema } from '../undefined/index.ts';
import type { UnionIssue, UnionSchema } from '../union/index.ts';
import { nonOptional, type NonOptionalSchema } from './nonOptional.ts';
import type { NonOptionalIssue } from './types.ts';

describe('nonOptional', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = NonOptionalSchema<
        NullishSchema<StringSchema<undefined>, undefined>,
        undefined
      >;
      expectTypeOf(nonOptional(nullish(string()))).toEqualTypeOf<Schema>();
      expectTypeOf(
        nonOptional(nullish(string()), undefined)
      ).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(nonOptional(nullish(string()), 'message')).toEqualTypeOf<
        NonOptionalSchema<
          NullishSchema<StringSchema<undefined>, undefined>,
          'message'
        >
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        nonOptional(nullish(string()), () => 'message')
      ).toEqualTypeOf<
        NonOptionalSchema<
          NullishSchema<StringSchema<undefined>, undefined>,
          () => string
        >
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = NonOptionalSchema<
      NullishSchema<StringSchema<undefined>, undefined>,
      undefined
    >;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<string | null>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<string | null>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
        NonOptionalIssue | StringIssue
      >();
      expectTypeOf<
        InferIssue<
          NonOptionalSchema<
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
        | NonOptionalIssue
        | StringIssue
        | NullIssue
        | UnionIssue<StringIssue | NullIssue>
      >();
    });
  });
});

import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import type { NullSchema } from '../null/index.ts';
import { nullishAsync, type NullishSchemaAsync } from '../nullish/index.ts';
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
import {
  nonNullableAsync,
  type NonNullableSchemaAsync,
} from './nonNullableAsync.ts';
import type { NonNullableIssue } from './types.ts';

describe('nonNullableAsync', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = NonNullableSchemaAsync<
        NullishSchemaAsync<StringSchema<undefined>, undefined>,
        undefined
      >;
      expectTypeOf(
        nonNullableAsync(nullishAsync(string()))
      ).toEqualTypeOf<Schema>();
      expectTypeOf(
        nonNullableAsync(nullishAsync(string()), undefined)
      ).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(
        nonNullableAsync(nullishAsync(string()), 'message')
      ).toEqualTypeOf<
        NonNullableSchemaAsync<
          NullishSchemaAsync<StringSchema<undefined>, undefined>,
          'message'
        >
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        nonNullableAsync(nullishAsync(string()), () => 'message')
      ).toEqualTypeOf<
        NonNullableSchemaAsync<
          NullishSchemaAsync<StringSchema<undefined>, undefined>,
          () => string
        >
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = NonNullableSchemaAsync<
      NullishSchemaAsync<StringSchema<undefined>, undefined>,
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
          NonNullableSchemaAsync<
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

import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import type { NullSchema } from '../null/index.ts';
import { nullishAsync, type NullishSchemaAsync } from '../nullish/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import type { UndefinedSchema } from '../undefined/index.ts';
import type { UnionIssue, UnionSchema } from '../union/index.ts';
import {
  nonNullishAsync,
  type NonNullishSchemaAsync,
} from './nonNullishAsync.ts';
import type { NonNullishIssue } from './types.ts';

describe('nonNullishAsync', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = NonNullishSchemaAsync<
        NullishSchemaAsync<StringSchema<undefined>, undefined>,
        undefined
      >;
      expectTypeOf(
        nonNullishAsync(nullishAsync(string()))
      ).toEqualTypeOf<Schema>();
      expectTypeOf(
        nonNullishAsync(nullishAsync(string()), undefined)
      ).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(
        nonNullishAsync(nullishAsync(string()), 'message')
      ).toEqualTypeOf<
        NonNullishSchemaAsync<
          NullishSchemaAsync<StringSchema<undefined>, undefined>,
          'message'
        >
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        nonNullishAsync(nullishAsync(string()), () => 'message')
      ).toEqualTypeOf<
        NonNullishSchemaAsync<
          NullishSchemaAsync<StringSchema<undefined>, undefined>,
          () => string
        >
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = NonNullishSchemaAsync<
      NullishSchemaAsync<StringSchema<undefined>, undefined>,
      undefined
    >;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
        NonNullishIssue | StringIssue
      >();
      expectTypeOf<
        InferIssue<
          NonNullishSchemaAsync<
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
        NonNullishIssue | StringIssue | UnionIssue<StringIssue>
      >();
    });
  });
});

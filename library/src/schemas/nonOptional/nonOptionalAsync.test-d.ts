import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import type { NullIssue, NullSchema } from '../null/index.ts';
import { nullishAsync, type NullishSchemaAsync } from '../nullish/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import type { UndefinedSchema } from '../undefined/index.ts';
import type { UnionIssue, UnionSchema } from '../union/index.ts';
import {
  nonOptionalAsync,
  type NonOptionalSchemaAsync,
} from './nonOptionalAsync.ts';
import type { NonOptionalIssue } from './types.ts';

describe('nonOptionalAsync', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = NonOptionalSchemaAsync<
        NullishSchemaAsync<StringSchema<undefined>, never>,
        undefined
      >;
      expectTypeOf(
        nonOptionalAsync(nullishAsync(string()))
      ).toEqualTypeOf<Schema>();
      expectTypeOf(
        nonOptionalAsync(nullishAsync(string()), undefined)
      ).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(
        nonOptionalAsync(nullishAsync(string()), 'message')
      ).toEqualTypeOf<
        NonOptionalSchemaAsync<
          NullishSchemaAsync<StringSchema<undefined>, never>,
          'message'
        >
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        nonOptionalAsync(nullishAsync(string()), () => 'message')
      ).toEqualTypeOf<
        NonOptionalSchemaAsync<
          NullishSchemaAsync<StringSchema<undefined>, never>,
          () => string
        >
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = NonOptionalSchemaAsync<
      NullishSchemaAsync<StringSchema<undefined>, never>,
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
          NonOptionalSchemaAsync<
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

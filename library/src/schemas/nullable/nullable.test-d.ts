import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import { nullable, type NullableSchema } from './nullable.ts';

describe('nullable', () => {
  describe('should return schema object', () => {
    test('with undefined default', () => {
      type Schema = NullableSchema<StringSchema<undefined>, undefined>;
      expectTypeOf(nullable(string())).toEqualTypeOf<Schema>();
      expectTypeOf(nullable(string(), undefined)).toEqualTypeOf<Schema>();
      expectTypeOf(nullable(string(), () => undefined)).toEqualTypeOf<
        NullableSchema<StringSchema<undefined>, () => undefined>
      >();
    });

    test('with value default', () => {
      expectTypeOf(nullable(string(), 'foo')).toEqualTypeOf<
        NullableSchema<StringSchema<undefined>, 'foo'>
      >();
    });

    test('with value getter default', () => {
      expectTypeOf(nullable(string(), () => 'message')).toEqualTypeOf<
        NullableSchema<StringSchema<undefined>, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = NullableSchema<StringSchema<undefined>, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<string | null>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<string | null>();
      expectTypeOf<
        InferOutput<NullableSchema<StringSchema<undefined>, 'foo'>>
      >().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<StringIssue>();
    });
  });
});

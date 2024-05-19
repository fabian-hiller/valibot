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
    test('with never default', () => {
      expectTypeOf(nullable(string())).toEqualTypeOf<
        NullableSchema<StringSchema<undefined>, never>
      >();
    });

    test('with null default', () => {
      expectTypeOf(nullable(string(), null)).toEqualTypeOf<
        NullableSchema<StringSchema<undefined>, null>
      >();
    });

    test('with null getter default', () => {
      expectTypeOf(nullable(string(), () => null)).toEqualTypeOf<
        NullableSchema<StringSchema<undefined>, () => null>
      >();
    });

    test('with value default', () => {
      expectTypeOf(nullable(string(), 'foo')).toEqualTypeOf<
        NullableSchema<StringSchema<undefined>, 'foo'>
      >();
    });

    test('with value getter default', () => {
      expectTypeOf(nullable(string(), () => 'foo')).toEqualTypeOf<
        NullableSchema<StringSchema<undefined>, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema1 = NullableSchema<StringSchema<undefined>, never>;
    type Schema2 = NullableSchema<StringSchema<undefined>, null>;
    type Schema3 = NullableSchema<StringSchema<undefined>, 'foo'>;
    type Schema4 = NullableSchema<StringSchema<undefined>, () => null>;
    type Schema5 = NullableSchema<StringSchema<undefined>, () => 'foo'>;

    test('of input', () => {
      type Input = string | null;
      expectTypeOf<InferInput<Schema1>>().toEqualTypeOf<Input>();
      expectTypeOf<InferInput<Schema2>>().toEqualTypeOf<Input>();
      expectTypeOf<InferInput<Schema3>>().toEqualTypeOf<Input>();
      expectTypeOf<InferInput<Schema4>>().toEqualTypeOf<Input>();
      expectTypeOf<InferInput<Schema5>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema1>>().toEqualTypeOf<string | null>();
      expectTypeOf<InferOutput<Schema2>>().toEqualTypeOf<string | null>();
      expectTypeOf<InferOutput<Schema3>>().toEqualTypeOf<string>();
      expectTypeOf<InferOutput<Schema4>>().toEqualTypeOf<string | null>();
      expectTypeOf<InferOutput<Schema5>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema1>>().toEqualTypeOf<StringIssue>();
      expectTypeOf<InferIssue<Schema2>>().toEqualTypeOf<StringIssue>();
      expectTypeOf<InferIssue<Schema3>>().toEqualTypeOf<StringIssue>();
      expectTypeOf<InferIssue<Schema4>>().toEqualTypeOf<StringIssue>();
      expectTypeOf<InferIssue<Schema5>>().toEqualTypeOf<StringIssue>();
    });
  });
});

import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import { nullableAsync, type NullableSchemaAsync } from './nullableAsync.ts';

describe('nullableAsync', () => {
  describe('should return schema object', () => {
    test('with undefined default', () => {
      type Schema = NullableSchemaAsync<StringSchema<undefined>, undefined>;
      expectTypeOf(nullableAsync(string())).toEqualTypeOf<Schema>();
      expectTypeOf(nullableAsync(string(), undefined)).toEqualTypeOf<Schema>();
    });

    test('with null default', () => {
      expectTypeOf(nullableAsync(string(), null)).toEqualTypeOf<
        NullableSchemaAsync<StringSchema<undefined>, null>
      >();
    });

    test('with null getter default', () => {
      expectTypeOf(nullableAsync(string(), () => null)).toEqualTypeOf<
        NullableSchemaAsync<StringSchema<undefined>, () => null>
      >();
    });

    test('with async null getter default', () => {
      expectTypeOf(nullableAsync(string(), async () => null)).toEqualTypeOf<
        NullableSchemaAsync<StringSchema<undefined>, () => Promise<null>>
      >();
    });

    test('with value default', () => {
      expectTypeOf(nullableAsync(string(), 'foo')).toEqualTypeOf<
        NullableSchemaAsync<StringSchema<undefined>, 'foo'>
      >();
    });

    test('with value getter default', () => {
      expectTypeOf(nullableAsync(string(), () => 'foo')).toEqualTypeOf<
        NullableSchemaAsync<StringSchema<undefined>, () => string>
      >();
    });

    test('with async value getter default', () => {
      expectTypeOf(nullableAsync(string(), async () => 'foo')).toEqualTypeOf<
        NullableSchemaAsync<StringSchema<undefined>, () => Promise<string>>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema1 = NullableSchemaAsync<StringSchema<undefined>, undefined>;
    type Schema2 = NullableSchemaAsync<StringSchema<undefined>, null>;
    type Schema3 = NullableSchemaAsync<StringSchema<undefined>, 'foo'>;
    type Schema4 = NullableSchemaAsync<StringSchema<undefined>, () => null>;
    type Schema5 = NullableSchemaAsync<StringSchema<undefined>, () => 'foo'>;
    type Schema6 = NullableSchemaAsync<
      StringSchema<undefined>,
      () => Promise<null>
    >;
    type Schema7 = NullableSchemaAsync<
      StringSchema<undefined>,
      () => Promise<'foo'>
    >;

    test('of input', () => {
      type Input = string | null;
      expectTypeOf<InferInput<Schema1>>().toEqualTypeOf<Input>();
      expectTypeOf<InferInput<Schema2>>().toEqualTypeOf<Input>();
      expectTypeOf<InferInput<Schema3>>().toEqualTypeOf<Input>();
      expectTypeOf<InferInput<Schema4>>().toEqualTypeOf<Input>();
      expectTypeOf<InferInput<Schema5>>().toEqualTypeOf<Input>();
      expectTypeOf<InferInput<Schema6>>().toEqualTypeOf<Input>();
      expectTypeOf<InferInput<Schema7>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema1>>().toEqualTypeOf<string | null>();
      expectTypeOf<InferOutput<Schema2>>().toEqualTypeOf<string | null>();
      expectTypeOf<InferOutput<Schema3>>().toEqualTypeOf<string>();
      expectTypeOf<InferOutput<Schema4>>().toEqualTypeOf<string | null>();
      expectTypeOf<InferOutput<Schema5>>().toEqualTypeOf<string>();
      expectTypeOf<InferOutput<Schema6>>().toEqualTypeOf<string | null>();
      expectTypeOf<InferOutput<Schema7>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema1>>().toEqualTypeOf<StringIssue>();
      expectTypeOf<InferIssue<Schema2>>().toEqualTypeOf<StringIssue>();
      expectTypeOf<InferIssue<Schema3>>().toEqualTypeOf<StringIssue>();
      expectTypeOf<InferIssue<Schema4>>().toEqualTypeOf<StringIssue>();
      expectTypeOf<InferIssue<Schema5>>().toEqualTypeOf<StringIssue>();
      expectTypeOf<InferIssue<Schema6>>().toEqualTypeOf<StringIssue>();
      expectTypeOf<InferIssue<Schema7>>().toEqualTypeOf<StringIssue>();
    });
  });
});

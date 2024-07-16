import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import { optionalAsync, type OptionalSchemaAsync } from './optionalAsync.ts';

describe('optionalAsync', () => {
  describe('should return schema object', () => {
    test('with never default', () => {
      expectTypeOf(optionalAsync(string())).toEqualTypeOf<
        OptionalSchemaAsync<StringSchema<undefined>, never>
      >();
    });

    test('with undefined default', () => {
      expectTypeOf(optionalAsync(string(), undefined)).toEqualTypeOf<
        OptionalSchemaAsync<StringSchema<undefined>, undefined>
      >();
    });

    test('with undefined getter default', () => {
      expectTypeOf(optionalAsync(string(), () => undefined)).toEqualTypeOf<
        OptionalSchemaAsync<StringSchema<undefined>, () => undefined>
      >();
    });

    test('with async undefined getter default', () => {
      expectTypeOf(
        optionalAsync(string(), async () => undefined)
      ).toEqualTypeOf<
        OptionalSchemaAsync<StringSchema<undefined>, () => Promise<undefined>>
      >();
    });

    test('with value default', () => {
      expectTypeOf(optionalAsync(string(), 'foo')).toEqualTypeOf<
        OptionalSchemaAsync<StringSchema<undefined>, 'foo'>
      >();
    });

    test('with value getter default', () => {
      expectTypeOf(optionalAsync(string(), () => 'foo')).toEqualTypeOf<
        OptionalSchemaAsync<StringSchema<undefined>, () => string>
      >();
    });

    test('with async value getter default', () => {
      expectTypeOf(optionalAsync(string(), async () => 'foo')).toEqualTypeOf<
        OptionalSchemaAsync<StringSchema<undefined>, () => Promise<string>>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema1 = OptionalSchemaAsync<StringSchema<undefined>, never>;
    type Schema2 = OptionalSchemaAsync<StringSchema<undefined>, undefined>;
    type Schema3 = OptionalSchemaAsync<StringSchema<undefined>, 'foo'>;
    type Schema4 = OptionalSchemaAsync<
      StringSchema<undefined>,
      () => undefined
    >;
    type Schema5 = OptionalSchemaAsync<StringSchema<undefined>, () => 'foo'>;
    type Schema6 = OptionalSchemaAsync<
      StringSchema<undefined>,
      () => Promise<undefined>
    >;
    type Schema7 = OptionalSchemaAsync<
      StringSchema<undefined>,
      () => Promise<'foo'>
    >;

    test('of input', () => {
      type Input = string | undefined;
      expectTypeOf<InferInput<Schema1>>().toEqualTypeOf<Input>();
      expectTypeOf<InferInput<Schema2>>().toEqualTypeOf<Input>();
      expectTypeOf<InferInput<Schema3>>().toEqualTypeOf<Input>();
      expectTypeOf<InferInput<Schema4>>().toEqualTypeOf<Input>();
      expectTypeOf<InferInput<Schema5>>().toEqualTypeOf<Input>();
      expectTypeOf<InferInput<Schema6>>().toEqualTypeOf<Input>();
      expectTypeOf<InferInput<Schema7>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema1>>().toEqualTypeOf<string | undefined>();
      expectTypeOf<InferOutput<Schema2>>().toEqualTypeOf<string | undefined>();
      expectTypeOf<InferOutput<Schema3>>().toEqualTypeOf<string>();
      expectTypeOf<InferOutput<Schema4>>().toEqualTypeOf<string | undefined>();
      expectTypeOf<InferOutput<Schema5>>().toEqualTypeOf<string>();
      expectTypeOf<InferOutput<Schema6>>().toEqualTypeOf<string | undefined>();
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

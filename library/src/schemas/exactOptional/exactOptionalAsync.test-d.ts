import { describe, expectTypeOf, test } from 'vitest';
import type { TransformActionAsync } from '../../actions/index.ts';
import type { SchemaWithPipeAsync } from '../../methods/index.ts';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import {
  exactOptionalAsync,
  type ExactOptionalSchemaAsync,
} from './exactOptionalAsync.ts';

describe('exactOptionalAsync', () => {
  describe('should return schema object', () => {
    test('with undefined default', () => {
      type Schema = ExactOptionalSchemaAsync<
        StringSchema<undefined>,
        undefined
      >;
      expectTypeOf(exactOptionalAsync(string())).toEqualTypeOf<Schema>();
      expectTypeOf(
        exactOptionalAsync(string(), undefined)
      ).toEqualTypeOf<Schema>();
    });

    test('with value default', () => {
      expectTypeOf(exactOptionalAsync(string(), 'foo')).toEqualTypeOf<
        ExactOptionalSchemaAsync<StringSchema<undefined>, 'foo'>
      >();
    });

    test('with value getter default', () => {
      expectTypeOf(exactOptionalAsync(string(), () => 'foo')).toEqualTypeOf<
        ExactOptionalSchemaAsync<StringSchema<undefined>, () => string>
      >();
    });

    test('with async value getter default', () => {
      expectTypeOf(
        exactOptionalAsync(string(), async () => 'foo')
      ).toEqualTypeOf<
        ExactOptionalSchemaAsync<StringSchema<undefined>, () => Promise<string>>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema1 = ExactOptionalSchemaAsync<StringSchema<undefined>, undefined>;
    type Schema2 = ExactOptionalSchemaAsync<StringSchema<undefined>, 'foo'>;
    type Schema3 = ExactOptionalSchemaAsync<
      StringSchema<undefined>,
      () => 'foo'
    >;
    type Schema4 = ExactOptionalSchemaAsync<
      StringSchema<undefined>,
      () => Promise<'foo'>
    >;
    type Schema5 = ExactOptionalSchemaAsync<
      SchemaWithPipeAsync<
        [StringSchema<undefined>, TransformActionAsync<string, number>]
      >,
      'foo'
    >;

    test('of input', () => {
      expectTypeOf<InferInput<Schema1>>().toEqualTypeOf<string>();
      expectTypeOf<InferInput<Schema2>>().toEqualTypeOf<string>();
      expectTypeOf<InferInput<Schema3>>().toEqualTypeOf<string>();
      expectTypeOf<InferInput<Schema4>>().toEqualTypeOf<string>();
      expectTypeOf<InferInput<Schema5>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema1>>().toEqualTypeOf<string>();
      expectTypeOf<InferOutput<Schema2>>().toEqualTypeOf<string>();
      expectTypeOf<InferOutput<Schema3>>().toEqualTypeOf<string>();
      expectTypeOf<InferOutput<Schema4>>().toEqualTypeOf<string>();
      expectTypeOf<InferOutput<Schema5>>().toEqualTypeOf<number>();
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

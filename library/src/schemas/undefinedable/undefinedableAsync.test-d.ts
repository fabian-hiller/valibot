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
  undefinedableAsync,
  type UndefinedableSchemaAsync,
} from './undefinedableAsync.ts';

describe('undefinedableAsync', () => {
  describe('should return schema object', () => {
    test('with undefined default', () => {
      type Schema = UndefinedableSchemaAsync<
        StringSchema<undefined>,
        undefined
      >;
      expectTypeOf(undefinedableAsync(string())).toEqualTypeOf<Schema>();
      expectTypeOf(
        undefinedableAsync(string(), undefined)
      ).toEqualTypeOf<Schema>();
    });

    test('with undefined getter default', () => {
      expectTypeOf(undefinedableAsync(string(), () => undefined)).toEqualTypeOf<
        UndefinedableSchemaAsync<StringSchema<undefined>, () => undefined>
      >();
    });

    test('with async undefined getter default', () => {
      expectTypeOf(
        undefinedableAsync(string(), async () => undefined)
      ).toEqualTypeOf<
        UndefinedableSchemaAsync<
          StringSchema<undefined>,
          () => Promise<undefined>
        >
      >();
    });

    test('with value default', () => {
      expectTypeOf(undefinedableAsync(string(), 'foo')).toEqualTypeOf<
        UndefinedableSchemaAsync<StringSchema<undefined>, 'foo'>
      >();
    });

    test('with value getter default', () => {
      expectTypeOf(undefinedableAsync(string(), () => 'foo')).toEqualTypeOf<
        UndefinedableSchemaAsync<StringSchema<undefined>, () => string>
      >();
    });

    test('with async value getter default', () => {
      expectTypeOf(
        undefinedableAsync(string(), async () => 'foo')
      ).toEqualTypeOf<
        UndefinedableSchemaAsync<StringSchema<undefined>, () => Promise<string>>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema1 = UndefinedableSchemaAsync<StringSchema<undefined>, undefined>;
    type Schema2 = UndefinedableSchemaAsync<StringSchema<undefined>, 'foo'>;
    type Schema3 = UndefinedableSchemaAsync<
      StringSchema<undefined>,
      () => undefined
    >;
    type Schema4 = UndefinedableSchemaAsync<
      StringSchema<undefined>,
      () => 'foo'
    >;
    type Schema5 = UndefinedableSchemaAsync<
      StringSchema<undefined>,
      () => Promise<undefined>
    >;
    type Schema6 = UndefinedableSchemaAsync<
      StringSchema<undefined>,
      () => Promise<'foo'>
    >;
    type Schema7 = UndefinedableSchemaAsync<
      SchemaWithPipeAsync<
        [StringSchema<undefined>, TransformActionAsync<string, number>]
      >,
      'foo'
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
      expectTypeOf<InferOutput<Schema2>>().toEqualTypeOf<string>();
      expectTypeOf<InferOutput<Schema3>>().toEqualTypeOf<string | undefined>();
      expectTypeOf<InferOutput<Schema4>>().toEqualTypeOf<string>();
      expectTypeOf<InferOutput<Schema5>>().toEqualTypeOf<string | undefined>();
      expectTypeOf<InferOutput<Schema6>>().toEqualTypeOf<string>();
      expectTypeOf<InferOutput<Schema7>>().toEqualTypeOf<number>();
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

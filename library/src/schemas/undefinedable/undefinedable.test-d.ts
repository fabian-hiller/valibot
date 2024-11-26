import { describe, expectTypeOf, test } from 'vitest';
import type { TransformAction } from '../../actions/index.ts';
import type { SchemaWithPipe } from '../../methods/index.ts';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import { undefinedable, type UndefinedableSchema } from './undefinedable.ts';

describe('undefinedable', () => {
  describe('should return schema object', () => {
    test('with undefined default', () => {
      type Schema = UndefinedableSchema<StringSchema<undefined>, undefined>;
      expectTypeOf(undefinedable(string())).toEqualTypeOf<Schema>();
      expectTypeOf(undefinedable(string(), undefined)).toEqualTypeOf<Schema>();
    });

    test('with undefined getter default', () => {
      expectTypeOf(undefinedable(string(), () => undefined)).toEqualTypeOf<
        UndefinedableSchema<StringSchema<undefined>, () => undefined>
      >();
    });

    test('with value default', () => {
      expectTypeOf(undefinedable(string(), 'foo')).toEqualTypeOf<
        UndefinedableSchema<StringSchema<undefined>, 'foo'>
      >();
    });

    test('with value getter default', () => {
      expectTypeOf(undefinedable(string(), () => 'foo')).toEqualTypeOf<
        UndefinedableSchema<StringSchema<undefined>, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema1 = UndefinedableSchema<StringSchema<undefined>, undefined>;
    type Schema2 = UndefinedableSchema<StringSchema<undefined>, 'foo'>;
    type Schema3 = UndefinedableSchema<
      StringSchema<undefined>,
      () => undefined
    >;
    type Schema4 = UndefinedableSchema<StringSchema<undefined>, () => 'foo'>;
    type Schema5 = UndefinedableSchema<
      SchemaWithPipe<
        [StringSchema<undefined>, TransformAction<string, number>]
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
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema1>>().toEqualTypeOf<string | undefined>();
      expectTypeOf<InferOutput<Schema2>>().toEqualTypeOf<string>();
      expectTypeOf<InferOutput<Schema3>>().toEqualTypeOf<string | undefined>();
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

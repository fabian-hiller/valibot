import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import { nullish, type NullishSchema } from './nullish.ts';

describe('nullish', () => {
  describe('should return schema object', () => {
    test('with undefined default', () => {
      type Schema = NullishSchema<StringSchema<undefined>, undefined>;
      expectTypeOf(nullish(string())).toEqualTypeOf<Schema>();
      expectTypeOf(nullish(string(), undefined)).toEqualTypeOf<Schema>();
    });

    test('with undefined getter default', () => {
      expectTypeOf(nullish(string(), () => undefined)).toEqualTypeOf<
        NullishSchema<StringSchema<undefined>, () => undefined>
      >();
    });

    test('with null default', () => {
      expectTypeOf(nullish(string(), null)).toEqualTypeOf<
        NullishSchema<StringSchema<undefined>, null>
      >();
    });

    test('with null getter default', () => {
      expectTypeOf(nullish(string(), () => null)).toEqualTypeOf<
        NullishSchema<StringSchema<undefined>, () => null>
      >();
    });

    test('with value default', () => {
      expectTypeOf(nullish(string(), 'foo')).toEqualTypeOf<
        NullishSchema<StringSchema<undefined>, 'foo'>
      >();
    });

    test('with value getter default', () => {
      expectTypeOf(nullish(string(), () => 'foo')).toEqualTypeOf<
        NullishSchema<StringSchema<undefined>, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema1 = NullishSchema<StringSchema<undefined>, undefined>;
    type Schema2 = NullishSchema<StringSchema<undefined>, null>;
    type Schema3 = NullishSchema<StringSchema<undefined>, 'foo'>;
    type Schema4 = NullishSchema<StringSchema<undefined>, () => undefined>;
    type Schema5 = NullishSchema<StringSchema<undefined>, () => null>;
    type Schema6 = NullishSchema<StringSchema<undefined>, () => 'foo'>;

    test('of input', () => {
      type Input = string | null | undefined;
      expectTypeOf<InferInput<Schema1>>().toEqualTypeOf<Input>();
      expectTypeOf<InferInput<Schema2>>().toEqualTypeOf<Input>();
      expectTypeOf<InferInput<Schema3>>().toEqualTypeOf<Input>();
      expectTypeOf<InferInput<Schema4>>().toEqualTypeOf<Input>();
      expectTypeOf<InferInput<Schema5>>().toEqualTypeOf<Input>();
      expectTypeOf<InferInput<Schema6>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema1>>().toEqualTypeOf<
        string | null | undefined
      >();
      expectTypeOf<InferOutput<Schema2>>().toEqualTypeOf<string | null>();
      expectTypeOf<InferOutput<Schema3>>().toEqualTypeOf<string>();
      expectTypeOf<InferOutput<Schema4>>().toEqualTypeOf<string | undefined>();
      expectTypeOf<InferOutput<Schema5>>().toEqualTypeOf<string | null>();
      expectTypeOf<InferOutput<Schema6>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema1>>().toEqualTypeOf<StringIssue>();
      expectTypeOf<InferIssue<Schema2>>().toEqualTypeOf<StringIssue>();
      expectTypeOf<InferIssue<Schema3>>().toEqualTypeOf<StringIssue>();
      expectTypeOf<InferIssue<Schema4>>().toEqualTypeOf<StringIssue>();
      expectTypeOf<InferIssue<Schema5>>().toEqualTypeOf<StringIssue>();
      expectTypeOf<InferIssue<Schema6>>().toEqualTypeOf<StringIssue>();
    });
  });
});

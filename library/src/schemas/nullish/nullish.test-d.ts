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
      expectTypeOf(nullish(string(), () => undefined)).toEqualTypeOf<
        NullishSchema<StringSchema<undefined>, () => undefined>
      >();
    });

    test('with value default', () => {
      expectTypeOf(nullish(string(), 'foo')).toEqualTypeOf<
        NullishSchema<StringSchema<undefined>, 'foo'>
      >();
    });

    test('with value getter default', () => {
      expectTypeOf(nullish(string(), () => 'message')).toEqualTypeOf<
        NullishSchema<StringSchema<undefined>, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = NullishSchema<StringSchema<undefined>, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<
        string | null | undefined
      >();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<
        string | null | undefined
      >();
      expectTypeOf<
        InferOutput<NullishSchema<StringSchema<undefined>, 'foo'>>
      >().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<StringIssue>();
    });
  });
});

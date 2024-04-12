import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import { optional, type OptionalSchema } from './optional.ts';

describe('optional', () => {
  describe('should return schema object', () => {
    test('with undefined default', () => {
      type Schema = OptionalSchema<StringSchema<undefined>, undefined>;
      expectTypeOf(optional(string())).toEqualTypeOf<Schema>();
      expectTypeOf(optional(string(), undefined)).toEqualTypeOf<Schema>();
      expectTypeOf(optional(string(), () => undefined)).toEqualTypeOf<
        OptionalSchema<StringSchema<undefined>, () => undefined>
      >();
    });

    test('with value default', () => {
      expectTypeOf(optional(string(), 'foo')).toEqualTypeOf<
        OptionalSchema<StringSchema<undefined>, 'foo'>
      >();
    });

    test('with value getter default', () => {
      expectTypeOf(optional(string(), () => 'message')).toEqualTypeOf<
        OptionalSchema<StringSchema<undefined>, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = OptionalSchema<StringSchema<undefined>, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<string | undefined>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<string | undefined>();
      expectTypeOf<
        InferOutput<OptionalSchema<StringSchema<undefined>, 'foo'>>
      >().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<StringIssue>();
    });
  });
});

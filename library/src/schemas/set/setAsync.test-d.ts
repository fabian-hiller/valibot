import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import type { OptionalSchema } from '../optional/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import { setAsync, type SetSchemaAsync } from './setAsync.ts';
import type { SetIssue } from './types.ts';

describe('setAsync', () => {
  describe('should return schema object', () => {
    const value = string();
    type Value = typeof value;

    test('with undefined message', () => {
      type Schema = SetSchemaAsync<Value, undefined>;
      expectTypeOf(setAsync(value)).toEqualTypeOf<Schema>();
      expectTypeOf(setAsync(value, undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(setAsync(value, 'message')).toEqualTypeOf<
        SetSchemaAsync<Value, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(setAsync(value, () => 'message')).toEqualTypeOf<
        SetSchemaAsync<Value, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = SetSchemaAsync<
      OptionalSchema<StringSchema<undefined>, 'foo'>,
      undefined
    >;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<
        Set<string | undefined>
      >();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<Set<string>>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
        SetIssue | StringIssue
      >();
    });
  });
});

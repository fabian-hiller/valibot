import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import type { OptionalSchema } from '../optional/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import { set, type SetSchema } from './set.ts';
import type { SetIssue } from './types.ts';

describe('set', () => {
  describe('should return schema object', () => {
    const value = string();
    type Value = typeof value;

    test('with undefined message', () => {
      type Schema = SetSchema<Value, undefined>;
      expectTypeOf(set(value)).toEqualTypeOf<Schema>();
      expectTypeOf(set(value, undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(set(value, 'message')).toEqualTypeOf<
        SetSchema<Value, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(set(value, () => 'message')).toEqualTypeOf<
        SetSchema<Value, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = SetSchema<
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

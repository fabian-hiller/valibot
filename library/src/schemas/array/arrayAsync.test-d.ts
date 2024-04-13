import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import type { OptionalSchema } from '../optional/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import type { ArrayIssue } from './array.ts';
import { arrayAsync, type ArraySchemaAsync } from './arrayAsync.ts';

describe('arrayAsync', () => {
  describe('should return schema arrayAsync', () => {
    const item = string();
    type Item = typeof item;

    test('with undefined message', () => {
      type Schema = ArraySchemaAsync<Item, undefined>;
      expectTypeOf(arrayAsync(item)).toEqualTypeOf<Schema>();
      expectTypeOf(arrayAsync(item, undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(arrayAsync(item, 'message')).toEqualTypeOf<
        ArraySchemaAsync<Item, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(arrayAsync(item, () => 'message')).toEqualTypeOf<
        ArraySchemaAsync<Item, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = ArraySchemaAsync<
      OptionalSchema<StringSchema<undefined>, 'foo'>,
      undefined
    >;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<
        (string | undefined)[]
      >();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<string[]>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
        ArrayIssue | StringIssue
      >();
    });
  });
});

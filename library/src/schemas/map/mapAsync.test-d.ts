import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  number,
  type NumberIssue,
  type NumberSchema,
} from '../number/index.ts';
import type { OptionalSchema, OptionalSchemaAsync } from '../optional/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import { mapAsync, type MapSchemaAsync } from './mapAsync.ts';
import type { MapIssue } from './types.ts';

describe('mapAsync', () => {
  describe('should return schema object', () => {
    const key = number();
    type Key = typeof key;
    const value = string();
    type Value = typeof value;

    test('with undefined message', () => {
      type Schema = MapSchemaAsync<Key, Value, undefined>;
      expectTypeOf(mapAsync(key, value)).toEqualTypeOf<Schema>();
      expectTypeOf(mapAsync(key, value, undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(mapAsync(key, value, 'message')).toEqualTypeOf<
        MapSchemaAsync<Key, Value, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(mapAsync(key, value, () => 'message')).toEqualTypeOf<
        MapSchemaAsync<Key, Value, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = MapSchemaAsync<
      OptionalSchema<NumberSchema<undefined>, 123>,
      OptionalSchemaAsync<StringSchema<undefined>, 'foo'>,
      undefined
    >;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<
        Map<number | undefined, string | undefined>
      >();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<Map<number, string>>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
        MapIssue | NumberIssue | StringIssue
      >();
    });
  });
});

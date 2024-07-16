import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  number,
  type NumberIssue,
  type NumberSchema,
} from '../number/index.ts';
import type { OptionalSchema } from '../optional/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import { map, type MapSchema } from './map.ts';
import type { MapIssue } from './types.ts';

describe('map', () => {
  describe('should return schema object', () => {
    const key = number();
    type Key = typeof key;
    const value = string();
    type Value = typeof value;

    test('with undefined message', () => {
      type Schema = MapSchema<Key, Value, undefined>;
      expectTypeOf(map(key, value)).toEqualTypeOf<Schema>();
      expectTypeOf(map(key, value, undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(map(key, value, 'message')).toEqualTypeOf<
        MapSchema<Key, Value, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(map(key, value, () => 'message')).toEqualTypeOf<
        MapSchema<Key, Value, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = MapSchema<
      OptionalSchema<NumberSchema<undefined>, 123>,
      OptionalSchema<StringSchema<undefined>, 'foo'>,
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

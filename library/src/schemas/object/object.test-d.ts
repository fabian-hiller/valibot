import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import type { NullishSchema } from '../nullish/index.ts';
import type { NumberIssue, NumberSchema } from '../number/index.ts';
import type { OptionalSchema } from '../optional/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import { object, type ObjectIssue, type ObjectSchema } from './object.ts';

describe('object', () => {
  describe('should return schema object', () => {
    const entries = { key: string() };
    type Entries = typeof entries;

    test('with undefined message', () => {
      type Schema = ObjectSchema<Entries, undefined>;
      expectTypeOf(object(entries)).toEqualTypeOf<Schema>();
      expectTypeOf(object(entries, undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(object(entries, 'message')).toEqualTypeOf<
        ObjectSchema<Entries, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(object(entries, () => 'message')).toEqualTypeOf<
        ObjectSchema<Entries, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = ObjectSchema<
      {
        key1: StringSchema<undefined>;
        key2: OptionalSchema<StringSchema<undefined>, 'foo'>;
        key3: NullishSchema<StringSchema<undefined>, undefined>;
        key4: ObjectSchema<{ key: NumberSchema<undefined> }, undefined>;
      },
      undefined
    >;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<{
        key1: string;
        key2?: string | undefined;
        key3?: string | null | undefined;
        key4: { key: number };
      }>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<{
        key1: string;
        key2: string;
        key3?: string | null | undefined;
        key4: { key: number };
      }>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
        ObjectIssue | StringIssue | NumberIssue
      >();
    });
  });
});

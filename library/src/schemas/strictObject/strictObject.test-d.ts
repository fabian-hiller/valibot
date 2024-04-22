import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import type { NullishSchema } from '../nullish/index.ts';
import { type NumberIssue, type NumberSchema } from '../number/index.ts';
import type { ObjectIssue, ObjectSchema } from '../object/index.ts';
import type { OptionalSchema } from '../optional/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import {
  strictObject,
  type StrictObjectIssue,
  type StrictObjectSchema,
} from './strictObject.ts';

describe('strictObject', () => {
  describe('should return schema object', () => {
    const entries = { key: string() };
    type Entries = typeof entries;

    test('with undefined message', () => {
      type Schema = StrictObjectSchema<Entries, undefined>;
      expectTypeOf(strictObject(entries)).toEqualTypeOf<Schema>();
      expectTypeOf(strictObject(entries, undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(strictObject(entries, 'message')).toEqualTypeOf<
        StrictObjectSchema<Entries, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(strictObject(entries, () => 'message')).toEqualTypeOf<
        StrictObjectSchema<Entries, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = StrictObjectSchema<
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
        StrictObjectIssue | ObjectIssue | StringIssue | NumberIssue
      >();
    });
  });
});

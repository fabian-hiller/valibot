import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import type { BooleanIssue, BooleanSchema } from '../boolean/index.ts';
import type { NullishSchema } from '../nullish/index.ts';
import {
  number,
  type NumberIssue,
  type NumberSchema,
} from '../number/index.ts';
import type { ObjectIssue, ObjectSchema } from '../object/index.ts';
import type { OptionalSchema } from '../optional/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import {
  objectWithRest,
  type ObjectWithRestIssue,
  type ObjectWithRestSchema,
} from './objectWithRest.ts';

describe('objectWithRest', () => {
  describe('should return schema object', () => {
    const entries = { key: string() };
    type Entries = typeof entries;
    const rest = number();
    type Rest = typeof rest;

    test('with undefined message', () => {
      type Schema = ObjectWithRestSchema<Entries, Rest, undefined>;
      expectTypeOf(objectWithRest(entries, rest)).toEqualTypeOf<Schema>();
      expectTypeOf(
        objectWithRest(entries, rest, undefined)
      ).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(objectWithRest(entries, rest, 'message')).toEqualTypeOf<
        ObjectWithRestSchema<Entries, Rest, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        objectWithRest(entries, rest, () => 'message')
      ).toEqualTypeOf<ObjectWithRestSchema<Entries, Rest, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Schema = ObjectWithRestSchema<
      {
        key1: StringSchema<undefined>;
        key2: OptionalSchema<StringSchema<undefined>, 'foo'>;
        key3: NullishSchema<StringSchema<undefined>, undefined>;
        key4: ObjectSchema<{ key: NumberSchema<undefined> }, undefined>;
      },
      BooleanSchema<undefined>,
      undefined
    >;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<
        {
          key1: string;
          key2?: string | undefined;
          key3?: string | null | undefined;
          key4: { key: number };
        } & { [key: string]: boolean }
      >();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<
        {
          key1: string;
          key2: string;
          key3?: string | null | undefined;
          key4: { key: number };
        } & { [key: string]: boolean }
      >();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
        | ObjectWithRestIssue
        | ObjectIssue
        | StringIssue
        | NumberIssue
        | BooleanIssue
      >();
    });
  });
});

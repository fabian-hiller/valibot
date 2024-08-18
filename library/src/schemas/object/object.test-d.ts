import { describe, expectTypeOf, test } from 'vitest';
import type { ReadonlyAction } from '../../actions/index.ts';
import type { SchemaWithPipe } from '../../methods/index.ts';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import type { LazySchema } from '../lazy/index.ts';
import type {
  NonNullableIssue,
  NonNullableSchema,
} from '../nonNullable/index.ts';
import type { NullishSchema } from '../nullish/index.ts';
import type { NumberIssue, NumberSchema } from '../number/index.ts';
import type { OptionalSchema } from '../optional/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import type { UndefinedIssue, UndefinedSchema } from '../undefined/index.ts';
import { object, type ObjectSchema } from './object.ts';
import type { ObjectIssue } from './types.ts';

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
        key3: NullishSchema<StringSchema<undefined>, never>;
        key4: ObjectSchema<{ key: NumberSchema<undefined> }, never>;
        key5: SchemaWithPipe<[StringSchema<undefined>, ReadonlyAction<string>]>;
        key6: LazySchema<UndefinedSchema<undefined>>;
        key7: NonNullableSchema<UndefinedSchema<undefined>, undefined>;
        key8: LazySchema<
          NonNullableSchema<
            NullishSchema<StringSchema<undefined>, 'foo'>,
            undefined
          >
        >;
      },
      undefined
    >;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<{
        key1: string;
        key2?: string | undefined;
        key3?: string | null | undefined;
        key4: { key: number };
        key5: string;
        key6: undefined;
        key7: undefined;
        key8?: string | undefined;
      }>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<{
        key1: string;
        key2: string;
        key3?: string | null | undefined;
        key4: { key: number };
        readonly key5: string;
        key6: undefined;
        key7: undefined;
        key8: string;
      }>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
        | ObjectIssue
        | StringIssue
        | NumberIssue
        | UndefinedIssue
        | NonNullableIssue
      >();
    });
  });
});

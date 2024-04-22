import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import type { ArrayIssue, ArraySchema } from '../array/index.ts';
import type { BooleanIssue, BooleanSchema } from '../boolean/boolean.ts';
import type { DateIssue, DateSchema } from '../date/date.ts';
import type { NullishSchema } from '../nullish/index.ts';
import type { NumberIssue, NumberSchema } from '../number/index.ts';
import type { ObjectIssue, ObjectSchema } from '../object/index.ts';
import type { OptionalSchema } from '../optional/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import { formData, type FormDataSchema } from './formData.ts';
import type { FormDataIssue } from './types.ts';

describe('formData', () => {
  describe('should return schema formData', () => {
    const entries = { key: string() };
    type Entries = typeof entries;

    test('with undefined message', () => {
      type Schema = FormDataSchema<Entries, undefined>;
      expectTypeOf(formData(entries)).toEqualTypeOf<Schema>();
      expectTypeOf(formData(entries, undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(formData(entries, 'message')).toEqualTypeOf<
        FormDataSchema<Entries, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(formData(entries, () => 'message')).toEqualTypeOf<
        FormDataSchema<Entries, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = FormDataSchema<
      {
        key1: StringSchema<undefined>;
        key2: OptionalSchema<StringSchema<undefined>, 'foo'>;
        key3: NullishSchema<StringSchema<undefined>, undefined>;
        key4: ObjectSchema<{ key: NumberSchema<undefined> }, undefined>;
        key5: ArraySchema<StringSchema<undefined>, undefined>;
        key6: ArraySchema<
          ObjectSchema<
            {
              key1: StringSchema<undefined>;
              key2: BooleanSchema<undefined>;
              key3: NumberSchema<undefined>;
              key4: DateSchema<undefined>;
            },
            undefined
          >,
          undefined
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
        key5: string[];
        key6: Array<{
          key1: string;
          key2: boolean;
          key3: number;
          key4: Date;
        }>;
      }>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<{
        key1: string;
        key2: string;
        key3?: string | null | undefined;
        key4: { key: number };
        key5: string[];
        key6: Array<{
          key1: string;
          key2: boolean;
          key3: number;
          key4: Date;
        }>;
      }>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
        | FormDataIssue
        | ObjectIssue
        | StringIssue
        | NumberIssue
        | ArrayIssue
        | BooleanIssue
        | DateIssue
      >();
    });
  });
});

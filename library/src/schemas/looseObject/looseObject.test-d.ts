import { describe, expectTypeOf, test } from 'vitest';
import type { ReadonlyAction, TransformAction } from '../../actions/index.ts';
import type { SchemaWithPipe } from '../../methods/index.ts';
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
import type { UndefinedableSchema } from '../undefinedable/index.ts';
import { looseObject, type LooseObjectSchema } from './looseObject.ts';
import type { LooseObjectIssue } from './types.ts';

describe('looseObject', () => {
  describe('should return schema object', () => {
    const entries = { key: string() };
    type Entries = typeof entries;

    test('with undefined message', () => {
      type Schema = LooseObjectSchema<Entries, undefined>;
      expectTypeOf(looseObject(entries)).toEqualTypeOf<Schema>();
      expectTypeOf(looseObject(entries, undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(looseObject(entries, 'message')).toEqualTypeOf<
        LooseObjectSchema<Entries, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(looseObject(entries, () => 'message')).toEqualTypeOf<
        LooseObjectSchema<Entries, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = LooseObjectSchema<
      {
        key1: StringSchema<undefined>;
        key2: OptionalSchema<StringSchema<undefined>, 'foo'>;
        key3: NullishSchema<StringSchema<undefined>, undefined>;
        key4: ObjectSchema<{ key: NumberSchema<undefined> }, undefined>;
        key5: SchemaWithPipe<[StringSchema<undefined>, ReadonlyAction<string>]>;
        key6: UndefinedableSchema<StringSchema<undefined>, 'bar'>;
        key7: SchemaWithPipe<
          [
            OptionalSchema<StringSchema<undefined>, undefined>,
            TransformAction<undefined | string, string>,
          ]
        >;
      },
      undefined
    >;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<
        {
          key1: string;
          key2?: string;
          key3?: string | null | undefined;
          key4: { key: number };
          key5: string;
          key6: string | undefined;
          key7?: string;
        } & { [key: string]: unknown }
      >();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<
        {
          key1: string;
          key2: string;
          key3?: string | null | undefined;
          key4: { key: number };
          readonly key5: string;
          key6: string;
          key7: string;
        } & { [key: string]: unknown }
      >();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
        LooseObjectIssue | ObjectIssue | StringIssue | NumberIssue
      >();
    });
  });
});

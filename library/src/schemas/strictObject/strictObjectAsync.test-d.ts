import { describe, expectTypeOf, test } from 'vitest';
import type { ReadonlyAction } from '../../actions/index.ts';
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
import {
  strictObjectAsync,
  type StrictObjectSchemaAsync,
} from './strictObjectAsync.ts';
import type { StrictObjectIssue } from './types.ts';

describe('strictObjectAsync', () => {
  describe('should return schema object', () => {
    const entries = { key: string() };
    type Entries = typeof entries;

    test('with undefined message', () => {
      type Schema = StrictObjectSchemaAsync<Entries, undefined>;
      expectTypeOf(strictObjectAsync(entries)).toEqualTypeOf<Schema>();
      expectTypeOf(
        strictObjectAsync(entries, undefined)
      ).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(strictObjectAsync(entries, 'message')).toEqualTypeOf<
        StrictObjectSchemaAsync<Entries, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(strictObjectAsync(entries, () => 'message')).toEqualTypeOf<
        StrictObjectSchemaAsync<Entries, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = StrictObjectSchemaAsync<
      {
        key1: StringSchema<undefined>;
        key2: OptionalSchema<StringSchema<undefined>, 'foo'>;
        key3: NullishSchema<StringSchema<undefined>, never>;
        key4: ObjectSchema<{ key: NumberSchema<undefined> }, never>;
        key5: SchemaWithPipe<[StringSchema<undefined>, ReadonlyAction<string>]>;
        key6: UndefinedableSchema<StringSchema<undefined>, 'bar'>;
      },
      undefined
    >;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<{
        key1: string;
        key2?: string;
        key3?: string | null | undefined;
        key4: { key: number };
        key5: string;
        key6: string | undefined;
      }>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<{
        key1: string;
        key2: string;
        key3?: string | null | undefined;
        key4: { key: number };
        readonly key5: string;
        key6: string;
      }>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
        StrictObjectIssue | ObjectIssue | StringIssue | NumberIssue
      >();
    });
  });
});

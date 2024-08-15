import { describe, expectTypeOf, test } from 'vitest';
import type { ReadonlyAction } from '../../actions/index.ts';
import type { SchemaWithPipe } from '../../methods/index.ts';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import type { LazySchemaAsync } from '../lazy/index.ts';
import type { NonNullableSchemaAsync } from '../nonNullable/index.ts';
import type { NonNullableIssue } from '../nonNullable/index.ts';
import type { NullishSchema } from '../nullish/index.ts';
import type { NumberIssue, NumberSchema } from '../number/index.ts';
import type { OptionalSchema } from '../optional/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import type { UndefinedIssue, UndefinedSchema } from '../undefined/index.ts';
import { objectAsync, type ObjectSchemaAsync } from './objectAsync.ts';
import type { ObjectIssue } from './types.ts';

describe('objectAsync', () => {
  describe('should return schema objectAsync', () => {
    const entries = { key: string() };
    type Entries = typeof entries;

    test('with undefined message', () => {
      type Schema = ObjectSchemaAsync<Entries, undefined>;
      expectTypeOf(objectAsync(entries)).toEqualTypeOf<Schema>();
      expectTypeOf(objectAsync(entries, undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(objectAsync(entries, 'message')).toEqualTypeOf<
        ObjectSchemaAsync<Entries, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(objectAsync(entries, () => 'message')).toEqualTypeOf<
        ObjectSchemaAsync<Entries, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = ObjectSchemaAsync<
      {
        key1: StringSchema<undefined>;
        key2: OptionalSchema<StringSchema<undefined>, 'foo'>;
        key3: NullishSchema<StringSchema<undefined>, never>;
        key4: ObjectSchemaAsync<{ key: NumberSchema<undefined> }, never>;
        key5: SchemaWithPipe<[StringSchema<undefined>, ReadonlyAction<string>]>;
        key6: LazySchemaAsync<UndefinedSchema<undefined>>;
        key7: NonNullableSchemaAsync<UndefinedSchema<undefined>, undefined>;
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

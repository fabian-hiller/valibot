import { describe, expectTypeOf, test } from 'vitest';
import type { ReadonlyAction, TransformAction } from '../../actions/index.ts';
import type {
  SchemaWithPipe,
  SchemaWithPipeAsync,
} from '../../methods/index.ts';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import type { AnySchema } from '../any/index.ts';
import type {
  ExactOptionalSchema,
  ExactOptionalSchemaAsync,
} from '../exactOptional/index.ts';
import type { NullishSchema, NullishSchemaAsync } from '../nullish/index.ts';
import type { NumberIssue, NumberSchema } from '../number/index.ts';
import type { OptionalSchema, OptionalSchemaAsync } from '../optional/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import type { UndefinedableSchema } from '../undefinedable/index.ts';
import type { UnknownSchema } from '../unknown/index.ts';
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
        key00: StringSchema<undefined>;
        key01: AnySchema;
        key02: UnknownSchema;
        key03: ObjectSchemaAsync<{ key: NumberSchema<undefined> }, undefined>;
        key04: SchemaWithPipe<
          [StringSchema<undefined>, ReadonlyAction<string>]
        >;
        key05: UndefinedableSchema<StringSchema<undefined>, 'bar'>;
        key06: SchemaWithPipe<
          [
            OptionalSchema<StringSchema<undefined>, undefined>,
            TransformAction<undefined | string, number>,
          ]
        >;
        key07: SchemaWithPipeAsync<
          [
            OptionalSchema<StringSchema<undefined>, undefined>,
            TransformAction<undefined | string, number>,
          ]
        >;
        key08: SchemaWithPipeAsync<
          [
            OptionalSchemaAsync<StringSchema<undefined>, undefined>,
            TransformAction<undefined | string, number>,
          ]
        >;

        // ExactOptionalSchema
        key10: ExactOptionalSchema<StringSchema<undefined>, undefined>;
        key11: ExactOptionalSchema<StringSchema<undefined>, 'foo'>;
        key12: ExactOptionalSchema<StringSchema<undefined>, () => 'foo'>;

        // ExactOptionalSchemaAsync
        key20: ExactOptionalSchemaAsync<StringSchema<undefined>, undefined>;
        key21: ExactOptionalSchemaAsync<StringSchema<undefined>, 'foo'>;
        key22: ExactOptionalSchemaAsync<StringSchema<undefined>, () => 'foo'>;
        key23: ExactOptionalSchemaAsync<
          StringSchema<undefined>,
          () => Promise<'foo'>
        >;

        // OptionalSchema
        key30: OptionalSchema<StringSchema<undefined>, undefined>;
        key31: OptionalSchema<StringSchema<undefined>, 'foo'>;
        key32: OptionalSchema<StringSchema<undefined>, () => undefined>;
        key33: OptionalSchema<StringSchema<undefined>, () => 'foo'>;

        // OptionalSchemaAsync
        key40: OptionalSchemaAsync<StringSchema<undefined>, undefined>;
        key41: OptionalSchemaAsync<StringSchema<undefined>, 'foo'>;
        key42: OptionalSchemaAsync<StringSchema<undefined>, () => undefined>;
        key43: OptionalSchemaAsync<StringSchema<undefined>, () => 'foo'>;
        key44: OptionalSchemaAsync<
          StringSchema<undefined>,
          () => Promise<undefined>
        >;
        key45: OptionalSchemaAsync<
          StringSchema<undefined>,
          () => Promise<'foo'>
        >;

        // NullishSchema
        key50: NullishSchema<StringSchema<undefined>, undefined>;
        key51: NullishSchema<StringSchema<undefined>, null>;
        key52: NullishSchema<StringSchema<undefined>, 'foo'>;
        key53: NullishSchema<StringSchema<undefined>, () => undefined>;
        key54: NullishSchema<StringSchema<undefined>, () => null>;
        key55: NullishSchema<StringSchema<undefined>, () => 'foo'>;

        // NullishSchemaAsync
        key60: NullishSchemaAsync<StringSchema<undefined>, undefined>;
        key61: NullishSchemaAsync<StringSchema<undefined>, null>;
        key62: NullishSchemaAsync<StringSchema<undefined>, 'foo'>;
        key63: NullishSchemaAsync<StringSchema<undefined>, () => undefined>;
        key64: NullishSchemaAsync<StringSchema<undefined>, () => null>;
        key65: NullishSchemaAsync<StringSchema<undefined>, () => 'foo'>;
        key66: NullishSchemaAsync<
          StringSchema<undefined>,
          () => Promise<undefined>
        >;
        key67: NullishSchemaAsync<StringSchema<undefined>, () => Promise<null>>;
        key68: NullishSchemaAsync<
          StringSchema<undefined>,
          () => Promise<'foo'>
        >;
      },
      undefined
    >;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<{
        key00: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        key01: any;
        key02: unknown;
        key03: { key: number };
        key04: string;
        key05: string | undefined;
        key06?: string | undefined;
        key07?: string | undefined;
        key08?: string | undefined;

        // ExactOptionalSchema
        key10?: string;
        key11?: string;
        key12?: string;

        // ExactOptionalSchemaAsync
        key20?: string;
        key21?: string;
        key22?: string;
        key23?: string;

        // OptionalSchema
        key30?: string | undefined;
        key31?: string | undefined;
        key32?: string | undefined;
        key33?: string | undefined;

        // OptionalSchemaAsync
        key40?: string | undefined;
        key41?: string | undefined;
        key42?: string | undefined;
        key43?: string | undefined;
        key44?: string | undefined;
        key45?: string | undefined;

        // NullishSchema
        key50?: string | null | undefined;
        key51?: string | null | undefined;
        key52?: string | null | undefined;
        key53?: string | null | undefined;
        key54?: string | null | undefined;
        key55?: string | null | undefined;

        // NullishSchemaAsync
        key60?: string | null | undefined;
        key61?: string | null | undefined;
        key62?: string | null | undefined;
        key63?: string | null | undefined;
        key64?: string | null | undefined;
        key65?: string | null | undefined;
        key66?: string | null | undefined;
        key67?: string | null | undefined;
        key68?: string | null | undefined;
      }>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<{
        key00: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        key01: any;
        key02: unknown;
        key03: { key: number };
        readonly key04: string;
        key05: string;
        key06?: number;
        key07?: number;
        key08?: number;

        // ExactOptionalSchema
        key10?: string;
        key11: string;
        key12: string;

        // ExactOptionalSchemaAsync
        key20?: string;
        key21: string;
        key22: string;
        key23: string;

        // OptionalSchema
        key30?: string | undefined;
        key31: string;
        key32: string | undefined;
        key33: string;

        // OptionalSchemaAsync
        key40?: string | undefined;
        key41: string;
        key42: string | undefined;
        key43: string;
        key44: string | undefined;
        key45: string;

        // NullishSchema
        key50?: string | null | undefined;
        key51: string | null;
        key52: string;
        key53: string | undefined;
        key54: string | null;
        key55: string;

        // NullishSchemaAsync
        key60?: string | null | undefined;
        key61: string | null;
        key62: string;
        key63: string | undefined;
        key64: string | null;
        key65: string;
        key66: string | undefined;
        key67: string | null;
        key68: string;
      }>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
        ObjectIssue | StringIssue | NumberIssue
      >();
    });
  });
});

import { describe, expectTypeOf, test } from 'vitest';
import type {
  Brand,
  BrandAction,
  ReadonlyAction,
  TransformAction,
} from '../../actions/index.ts';
import type {
  SchemaWithPipe,
  SchemaWithPipeAsync,
} from '../../methods/index.ts';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import type { AnySchema } from '../any/index.ts';
import type { BooleanIssue, BooleanSchema } from '../boolean/index.ts';
import type { CustomIssue, CustomSchemaAsync } from '../custom/index.ts';
import type {
  ExactOptionalSchema,
  ExactOptionalSchemaAsync,
} from '../exactOptional/index.ts';
import type { NullishSchema, NullishSchemaAsync } from '../nullish/index.ts';
import {
  number,
  type NumberIssue,
  type NumberSchema,
} from '../number/index.ts';
import type { ObjectIssue, ObjectSchemaAsync } from '../object/index.ts';
import type { OptionalSchema, OptionalSchemaAsync } from '../optional/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import type { UndefinedableSchema } from '../undefinedable/index.ts';
import type { UnknownSchema } from '../unknown/index.ts';
import {
  objectWithRestAsync,
  type ObjectWithRestSchemaAsync,
} from './objectWithRestAsync.ts';
import type { ObjectWithRestIssue } from './types.ts';

describe('objectWithRestAsync', () => {
  describe('should return schema object', () => {
    const entries = { key: string() };
    type Entries = typeof entries;
    const rest = number();
    type Rest = typeof rest;

    test('with undefined message', () => {
      type Schema = ObjectWithRestSchemaAsync<Entries, Rest, undefined>;
      expectTypeOf(objectWithRestAsync(entries, rest)).toEqualTypeOf<Schema>();
      expectTypeOf(
        objectWithRestAsync(entries, rest, undefined)
      ).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(objectWithRestAsync(entries, rest, 'message')).toEqualTypeOf<
        ObjectWithRestSchemaAsync<Entries, Rest, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        objectWithRestAsync(entries, rest, () => 'message')
      ).toEqualTypeOf<ObjectWithRestSchemaAsync<Entries, Rest, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Schema = ObjectWithRestSchemaAsync<
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
        key09: CustomSchemaAsync<`a${string}` | `b${string}`, undefined>;
        key10: SchemaWithPipe<
          [StringSchema<undefined>, BrandAction<string, 'foo'>]
        >;

        // ExactOptionalSchema
        key20: ExactOptionalSchema<StringSchema<undefined>, undefined>;
        key21: ExactOptionalSchema<StringSchema<undefined>, 'foo'>;
        key22: ExactOptionalSchema<StringSchema<undefined>, () => 'foo'>;

        // ExactOptionalSchemaAsync
        key30: ExactOptionalSchemaAsync<StringSchema<undefined>, undefined>;
        key31: ExactOptionalSchemaAsync<StringSchema<undefined>, 'foo'>;
        key32: ExactOptionalSchemaAsync<StringSchema<undefined>, () => 'foo'>;
        key33: ExactOptionalSchemaAsync<
          StringSchema<undefined>,
          () => Promise<'foo'>
        >;

        // OptionalSchema
        key40: OptionalSchema<StringSchema<undefined>, undefined>;
        key41: OptionalSchema<StringSchema<undefined>, 'foo'>;
        key42: OptionalSchema<StringSchema<undefined>, () => undefined>;
        key43: OptionalSchema<StringSchema<undefined>, () => 'foo'>;

        // OptionalSchemaAsync
        key50: OptionalSchemaAsync<StringSchema<undefined>, undefined>;
        key51: OptionalSchemaAsync<StringSchema<undefined>, 'foo'>;
        key52: OptionalSchemaAsync<StringSchema<undefined>, () => undefined>;
        key53: OptionalSchemaAsync<StringSchema<undefined>, () => 'foo'>;
        key54: OptionalSchemaAsync<
          StringSchema<undefined>,
          () => Promise<undefined>
        >;
        key55: OptionalSchemaAsync<
          StringSchema<undefined>,
          () => Promise<'foo'>
        >;

        // NullishSchema
        key60: NullishSchema<StringSchema<undefined>, undefined>;
        key61: NullishSchema<StringSchema<undefined>, null>;
        key62: NullishSchema<StringSchema<undefined>, 'foo'>;
        key63: NullishSchema<StringSchema<undefined>, () => undefined>;
        key64: NullishSchema<StringSchema<undefined>, () => null>;
        key65: NullishSchema<StringSchema<undefined>, () => 'foo'>;

        // NullishSchemaAsync
        key70: NullishSchemaAsync<StringSchema<undefined>, undefined>;
        key71: NullishSchemaAsync<StringSchema<undefined>, null>;
        key72: NullishSchemaAsync<StringSchema<undefined>, 'foo'>;
        key73: NullishSchemaAsync<StringSchema<undefined>, () => undefined>;
        key74: NullishSchemaAsync<StringSchema<undefined>, () => null>;
        key75: NullishSchemaAsync<StringSchema<undefined>, () => 'foo'>;
        key76: NullishSchemaAsync<
          StringSchema<undefined>,
          () => Promise<undefined>
        >;
        key77: NullishSchemaAsync<StringSchema<undefined>, () => Promise<null>>;
        key78: NullishSchemaAsync<
          StringSchema<undefined>,
          () => Promise<'foo'>
        >;
      },
      BooleanSchema<undefined>,
      undefined
    >;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<
        {
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
          key09: `a${string}` | `b${string}`;
          key10: string;

          // ExactOptionalSchema
          key20?: string;
          key21?: string;
          key22?: string;

          // ExactOptionalSchemaAsync
          key30?: string;
          key31?: string;
          key32?: string;
          key33?: string;

          // OptionalSchema
          key40?: string | undefined;
          key41?: string | undefined;
          key42?: string | undefined;
          key43?: string | undefined;

          // OptionalSchemaAsync
          key50?: string | undefined;
          key51?: string | undefined;
          key52?: string | undefined;
          key53?: string | undefined;
          key54?: string | undefined;
          key55?: string | undefined;

          // NullishSchema
          key60?: string | null | undefined;
          key61?: string | null | undefined;
          key62?: string | null | undefined;
          key63?: string | null | undefined;
          key64?: string | null | undefined;
          key65?: string | null | undefined;

          // NullishSchemaAsync
          key70?: string | null | undefined;
          key71?: string | null | undefined;
          key72?: string | null | undefined;
          key73?: string | null | undefined;
          key74?: string | null | undefined;
          key75?: string | null | undefined;
          key76?: string | null | undefined;
          key77?: string | null | undefined;
          key78?: string | null | undefined;
        } & { [key: string]: boolean }
      >();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<
        {
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
          key09: `a${string}` | `b${string}`;
          key10: string & Brand<'foo'>;

          // ExactOptionalSchema
          key20?: string;
          key21: string;
          key22: string;

          // ExactOptionalSchemaAsync
          key30?: string;
          key31: string;
          key32: string;
          key33: string;

          // OptionalSchema
          key40?: string | undefined;
          key41: string;
          key42: string | undefined;
          key43: string;

          // OptionalSchemaAsync
          key50?: string | undefined;
          key51: string;
          key52: string | undefined;
          key53: string;
          key54: string | undefined;
          key55: string;

          // NullishSchema
          key60?: string | null | undefined;
          key61: string | null;
          key62: string;
          key63: string | undefined;
          key64: string | null;
          key65: string;

          // NullishSchemaAsync
          key70?: string | null | undefined;
          key71: string | null;
          key72: string;
          key73: string | undefined;
          key74: string | null;
          key75: string;
          key76: string | undefined;
          key77: string | null;
          key78: string;
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
        | CustomIssue
      >();
    });
  });
});

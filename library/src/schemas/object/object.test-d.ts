import { describe, expectTypeOf, test } from 'vitest';
import {
  type ReadonlyAction,
  type TransformAction,
} from '../../actions/index.ts';
import { type SchemaWithPipe } from '../../methods/index.ts';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import type { AnySchema } from '../any/index.ts';
import type { CustomSchema } from '../custom/custom.ts';
import type { CustomIssue } from '../custom/types.ts';
import type { ExactOptionalSchema } from '../exactOptional/index.ts';
import type { NullishSchema } from '../nullish/index.ts';
import type { NumberIssue, NumberSchema } from '../number/index.ts';
import type { OptionalSchema } from '../optional/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import type { UndefinedableSchema } from '../undefinedable/index.ts';
import type { UnknownSchema } from '../unknown/index.ts';
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
        key00: StringSchema<undefined>;
        key01: AnySchema;
        key02: UnknownSchema;
        key03: ObjectSchema<{ key: NumberSchema<undefined> }, undefined>;
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
        key07: SchemaWithPipe<
          [StringSchema<undefined>, TransformAction<string, string & {}>]
        >;
        key08: CustomSchema<string & {}, string & {}>;

        // ExactOptionalSchema
        key10: ExactOptionalSchema<StringSchema<undefined>, undefined>;
        key11: ExactOptionalSchema<StringSchema<undefined>, 'foo'>;
        key12: ExactOptionalSchema<StringSchema<undefined>, () => 'foo'>;

        // OptionalSchema
        key20: OptionalSchema<StringSchema<undefined>, undefined>;
        key21: OptionalSchema<StringSchema<undefined>, 'foo'>;
        key22: OptionalSchema<StringSchema<undefined>, () => undefined>;
        key23: OptionalSchema<StringSchema<undefined>, () => 'foo'>;

        // NullishSchema
        key30: NullishSchema<StringSchema<undefined>, undefined>;
        key31: NullishSchema<StringSchema<undefined>, null>;
        key32: NullishSchema<StringSchema<undefined>, 'foo'>;
        key33: NullishSchema<StringSchema<undefined>, () => undefined>;
        key34: NullishSchema<StringSchema<undefined>, () => null>;
        key35: NullishSchema<StringSchema<undefined>, () => 'foo'>;
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
        key07: string;
        key08: string & {};

        // ExactOptionalSchema
        key10?: string;
        key11?: string;
        key12?: string;

        // OptionalSchema
        key20?: string | undefined;
        key21?: string | undefined;
        key22?: string | undefined;
        key23?: string | undefined;

        // NullishSchema
        key30?: string | null | undefined;
        key31?: string | null | undefined;
        key32?: string | null | undefined;
        key33?: string | null | undefined;
        key34?: string | null | undefined;
        key35?: string | null | undefined;
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
        key07: string & {};
        key08: string & {};

        // ExactOptionalSchema
        key10?: string;
        key11: string;
        key12: string;

        // OptionalSchema
        key20?: string | undefined;
        key21: string;
        key22: string | undefined;
        key23: string;

        // NullishSchema
        key30?: string | null | undefined;
        key31: string | null;
        key32: string;
        key33: string | undefined;
        key34: string | null;
        key35: string;
      }>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
        ObjectIssue | StringIssue | NumberIssue | CustomIssue
      >();
    });
  });
});

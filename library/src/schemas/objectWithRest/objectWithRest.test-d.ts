import { describe, expectTypeOf, test } from 'vitest';
import type { ReadonlyAction, TransformAction } from '../../actions/index.ts';
import type { SchemaWithPipe } from '../../methods/index.ts';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import type { AnySchema } from '../any/index.ts';
import type { BooleanIssue, BooleanSchema } from '../boolean/index.ts';
import type { ExactOptionalSchema } from '../exactOptional/index.ts';
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
import type { UndefinedableSchema } from '../undefinedable/index.ts';
import type { UnknownSchema } from '../unknown/index.ts';
import { objectWithRest, type ObjectWithRestSchema } from './objectWithRest.ts';
import type { ObjectWithRestIssue } from './types.ts';

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

import { describe, expect, test } from 'vitest';
import { decimal, email, url } from '../../actions/index.ts';
import { pipe } from '../../methods/index.ts';
import { EMAIL_REGEX } from '../../regex.ts';
import type {
  InferIssue,
  InferOutput,
  TypedDataset,
  UntypedDataset,
} from '../../types/index.ts';
import { expectNoSchemaIssue } from '../../vitest/index.ts';
import { bigint } from '../bigint/bigint.ts';
import { boolean } from '../boolean/index.ts';
import { literal } from '../literal/literal.ts';
import { null_ } from '../null/null.ts';
import { number } from '../number/index.ts';
import { object } from '../object/index.ts';
import { strictObject } from '../strictObject/index.ts';
import { string } from '../string/index.ts';
import { variant, type VariantSchema } from './variant.ts';

// TODO: Add test for invalid type inputs

describe('variant', () => {
  describe('should return schema object', () => {
    const key = 'type' as const;
    type Key = typeof key;
    const options = [
      object({ type: literal('foo') }),
      strictObject({ type: literal('bar') }),
    ] as const;
    type Options = typeof options;
    const baseSchema: Omit<VariantSchema<Key, Options, never>, 'message'> = {
      kind: 'schema',
      type: 'variant',
      reference: variant,
      expects: 'Object',
      key,
      options,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: VariantSchema<Key, Options, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(variant(key, options)).toStrictEqual(schema);
      expect(variant(key, options, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(variant(key, options, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies VariantSchema<Key, Options, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(variant(key, options, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies VariantSchema<Key, Options, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    test('for simple variants', () => {
      expectNoSchemaIssue(
        variant('type', [
          object({ type: literal('foo') }),
          object({ type: literal('bar') }),
          object({ type: null_() }),
        ]),
        [{ type: 'foo' }, { type: 'bar' }, { type: null }]
      );
    });

    test('for same discriminators', () => {
      expectNoSchemaIssue(
        variant('type', [
          object({ type: literal('foo'), other: string() }),
          object({ type: literal('foo'), other: number() }),
          object({ type: literal('foo'), other: boolean() }),
        ]),
        [
          { type: 'foo', other: 'hello' },
          { type: 'foo', other: 123 },
          { type: 'foo', other: true },
        ]
      );
    });

    test('for nested variants', () => {
      expectNoSchemaIssue(
        variant('type', [
          object({ type: literal('foo') }),
          variant('type', [
            object({ type: literal('bar') }),
            object({ type: null_() }),
          ]),
        ]),
        [{ type: 'foo' }, { type: 'bar' }, { type: null }]
      );
    });

    test('for deeply nested variants', () => {
      expectNoSchemaIssue(
        variant('type', [
          object({ type: literal('foo') }),
          variant('type', [
            object({ type: literal('bar') }),
            variant('type', [object({ type: null_() })]),
          ]),
        ]),
        [{ type: 'foo' }, { type: 'bar' }, { type: null }]
      );
    });
  });

  describe('should return dataset with issues', () => {
    const baseInfo = {
      message: expect.any(String),
      requirement: undefined,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
      skipPipe: undefined,
    };

    test('for invalid base type', () => {
      const schema = variant('type', [
        object({ type: literal('foo') }),
        object({ type: literal('bar') }),
      ]);
      expect(schema._run({ typed: false, value: 'foo' }, {})).toStrictEqual({
        typed: false,
        value: 'foo',
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'variant',
            input: 'foo',
            expected: 'Object',
            received: '"foo"',
          },
        ],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('for empty options', () => {
      const schema = variant('type', []);
      const input = { type: 'foo' };
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'variant',
            input: input.type,
            expected: 'never',
            received: `"${input.type}"`,
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'type',
                value: input.type,
              },
            ],
          },
        ],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('for missing discriminator', () => {
      const schema = variant('type', [
        object({ type: literal('foo') }),
        object({ type: literal('bar') }),
      ]);
      const input = { other: 123 };
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'variant',
            input: undefined,
            expected: '"foo" | "bar"',
            received: 'undefined',
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'type',
                value: undefined,
              },
            ],
          },
        ],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('for invalid discriminator', () => {
      const schema = variant('type', [
        object({ type: literal('foo') }),
        object({ type: literal('bar') }),
      ]);
      const input = { type: 'baz' };
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'variant',
            input: input.type,
            expected: '"foo" | "bar"',
            received: `"${input.type}"`,
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'type',
                value: input.type,
              },
            ],
          },
        ],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('for nested invalid discriminator', () => {
      const schema = variant('type', [
        object({ type: literal('foo') }),
        variant('other', [
          object({ type: literal('bar'), other: string() }),
          object({ type: literal('baz'), other: number() }),
        ]),
      ]);
      const input = { type: 'bar', other: null };
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'variant',
            input: input.other,
            expected: 'string | number',
            received: `${input.other}`,
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'other',
                value: input.other,
              },
            ],
          },
        ],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('for untyped object', () => {
      const schema = variant('type', [
        object({ type: literal('foo'), other: bigint() }),
        object({ type: literal('bar'), other: string() }),
        object({ type: literal('baz'), other: number() }),
      ]);
      const input = { type: 'bar', other: null };
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'string',
            input: input.other,
            expected: 'string',
            received: `${input.other}`,
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'other',
                value: input.other,
              },
            ],
          },
        ],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('for nested untyped object', () => {
      const schema = variant('type', [
        object({ type: literal('foo') }),
        variant('type', [
          object({ type: literal('bar'), other: string() }),
          object({ type: literal('baz'), other: number() }),
        ]),
      ]);
      const input = { type: 'bar', other: null };
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'string',
            input: input.other,
            expected: 'string',
            received: `${input.other}`,
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'other',
                value: input.other,
              },
            ],
          },
        ],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('for multiple untyped objects', () => {
      const schema = variant('type', [
        object({ type: literal('foo'), other: bigint() }),
        object({ type: literal('bar'), other: string() }),
        object({ type: literal('bar'), other: number() }),
        object({ type: literal('bar'), other: boolean() }),
      ]);
      const input = { type: 'bar', other: null };
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'string',
            input: input.other,
            expected: 'string',
            received: `${input.other}`,
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'other',
                value: input.other,
              },
            ],
          },
        ],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('for typed objects', () => {
      const schema = variant('type', [
        object({ type: literal('foo'), other: number() }),
        object({ type: literal('bar'), other: pipe(string(), email()) }),
        object({ type: literal('baz'), other: boolean() }),
      ]);
      type Schema = typeof schema;
      const input = { type: 'bar', other: 'hello' } as const;
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: true,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'validation',
            type: 'email',
            input: input.other,
            expected: null,
            received: `"${input.other}"`,
            requirement: EMAIL_REGEX,
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'other',
                value: input.other,
              },
            ],
          },
        ],
      } satisfies TypedDataset<InferOutput<Schema>, InferIssue<Schema>>);
    });

    test('for nested typed objects', () => {
      const schema = variant('type', [
        object({ type: literal('foo'), other: number() }),
        variant('type', [
          object({ type: literal('bar'), other: pipe(string(), email()) }),
          object({ type: literal('baz'), other: boolean() }),
        ]),
      ]);
      type Schema = typeof schema;
      const input = { type: 'bar', other: 'hello' } as const;
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: true,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'validation',
            type: 'email',
            input: input.other,
            expected: null,
            received: `"${input.other}"`,
            requirement: EMAIL_REGEX,
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'other',
                value: input.other,
              },
            ],
          },
        ],
      } satisfies TypedDataset<InferOutput<Schema>, InferIssue<Schema>>);
    });

    test('for multiple typed objects', () => {
      const schema = variant('type', [
        object({ type: literal('foo'), other: number() }),
        object({ type: literal('foo'), other: pipe(string(), email()) }),
        object({ type: literal('foo'), other: pipe(string(), url()) }),
        object({ type: literal('foo'), other: pipe(string(), decimal()) }),
        object({ type: literal('foo'), other: boolean() }),
      ]);
      type Schema = typeof schema;
      const input = { type: 'foo', other: 'hello' } as const;
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: true,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'validation',
            type: 'email',
            input: input.other,
            expected: null,
            received: `"${input.other}"`,
            requirement: EMAIL_REGEX,
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'other',
                value: input.other,
              },
            ],
          },
        ],
      } satisfies TypedDataset<InferOutput<Schema>, InferIssue<Schema>>);
    });
  });
});

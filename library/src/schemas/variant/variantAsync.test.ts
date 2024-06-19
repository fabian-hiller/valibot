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
import { expectNoSchemaIssueAsync } from '../../vitest/index.ts';
import { bigint } from '../bigint/bigint.ts';
import { boolean } from '../boolean/index.ts';
import { literal } from '../literal/literal.ts';
import { null_ } from '../null/null.ts';
import { number } from '../number/index.ts';
import { object, objectAsync } from '../object/index.ts';
import { strictObjectAsync } from '../strictObject/index.ts';
import { string } from '../string/index.ts';
import { variantAsync, type VariantSchemaAsync } from './variantAsync.ts';

// TODO: Add test for invalid type inputs

describe('variantAsync', () => {
  describe('should return schema object', () => {
    const key = 'type' as const;
    type Key = typeof key;
    const options = [
      object({ type: literal('foo') }),
      strictObjectAsync({ type: literal('bar') }),
    ] as const;
    type Options = typeof options;
    const baseSchema: Omit<
      VariantSchemaAsync<Key, Options, never>,
      'message'
    > = {
      kind: 'schema',
      type: 'variant',
      reference: variantAsync,
      expects: 'Object',
      key,
      options,
      async: true,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: VariantSchemaAsync<Key, Options, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(variantAsync(key, options)).toStrictEqual(schema);
      expect(variantAsync(key, options, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(variantAsync(key, options, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies VariantSchemaAsync<Key, Options, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(variantAsync(key, options, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies VariantSchemaAsync<Key, Options, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    test('for simple variants', async () => {
      await expectNoSchemaIssueAsync(
        variantAsync('type', [
          object({ type: literal('foo') }),
          object({ type: literal('bar') }),
          objectAsync({ type: null_() }),
        ]),
        [{ type: 'foo' }, { type: 'bar' }, { type: null }]
      );
    });

    test('for same discriminators', async () => {
      await expectNoSchemaIssueAsync(
        variantAsync('type', [
          object({ type: literal('foo'), other: string() }),
          object({ type: literal('foo'), other: number() }),
          objectAsync({ type: literal('foo'), other: boolean() }),
        ]),
        [
          { type: 'foo', other: 'hello' },
          { type: 'foo', other: 123 },
          { type: 'foo', other: true },
        ]
      );
    });

    test('for nested variants', async () => {
      await expectNoSchemaIssueAsync(
        variantAsync('type', [
          object({ type: literal('foo') }),
          variantAsync('type', [
            object({ type: literal('bar') }),
            objectAsync({ type: null_() }),
          ]),
        ]),
        [{ type: 'foo' }, { type: 'bar' }, { type: null }]
      );
    });

    test('for deeply nested variants', async () => {
      await expectNoSchemaIssueAsync(
        variantAsync('type', [
          object({ type: literal('foo') }),
          variantAsync('type', [
            object({ type: literal('bar') }),
            variantAsync('type', [object({ type: null_() })]),
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
    };

    test('for invalid base type', async () => {
      const schema = variantAsync('type', [
        object({ type: literal('foo') }),
        objectAsync({ type: literal('bar') }),
      ]);
      expect(
        await schema._run({ typed: false, value: 'foo' }, {})
      ).toStrictEqual({
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

    test('for empty options', async () => {
      const schema = variantAsync('type', []);
      const input = { type: 'foo' };
      expect(
        await schema._run({ typed: false, value: input }, {})
      ).toStrictEqual({
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

    test('for missing discriminator', async () => {
      const schema = variantAsync('type', [
        object({ type: literal('foo') }),
        objectAsync({ type: literal('bar') }),
      ]);
      const input = { other: 123 };
      expect(
        await schema._run({ typed: false, value: input }, {})
      ).toStrictEqual({
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

    test('for invalid discriminator', async () => {
      const schema = variantAsync('type', [
        object({ type: literal('foo') }),
        objectAsync({ type: literal('bar') }),
      ]);
      const input = { type: 'baz' };
      expect(
        await schema._run({ typed: false, value: input }, {})
      ).toStrictEqual({
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

    test('for nested invalid discriminator', async () => {
      const schema = variantAsync('type', [
        object({ type: literal('foo') }),
        variantAsync('other', [
          object({ type: literal('bar'), other: string() }),
          objectAsync({ type: literal('baz'), other: number() }),
        ]),
      ]);
      const input = { type: 'bar', other: null };
      expect(
        await schema._run({ typed: false, value: input }, {})
      ).toStrictEqual({
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

    test('for untyped object', async () => {
      const schema = variantAsync('type', [
        object({ type: literal('foo'), other: bigint() }),
        object({ type: literal('bar'), other: string() }),
        objectAsync({ type: literal('baz'), other: number() }),
      ]);
      const input = { type: 'bar', other: null };
      expect(
        await schema._run({ typed: false, value: input }, {})
      ).toStrictEqual({
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

    test('for nested untyped object', async () => {
      const schema = variantAsync('type', [
        object({ type: literal('foo') }),
        variantAsync('type', [
          object({ type: literal('bar'), other: string() }),
          objectAsync({ type: literal('baz'), other: number() }),
        ]),
      ]);
      const input = { type: 'bar', other: null };
      expect(
        await schema._run({ typed: false, value: input }, {})
      ).toStrictEqual({
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

    test('for multiple untyped objects', async () => {
      const schema = variantAsync('type', [
        object({ type: literal('foo'), other: bigint() }),
        object({ type: literal('bar'), other: string() }),
        object({ type: literal('bar'), other: number() }),
        objectAsync({ type: literal('bar'), other: boolean() }),
      ]);
      const input = { type: 'bar', other: null };
      expect(
        await schema._run({ typed: false, value: input }, {})
      ).toStrictEqual({
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

    test('for typed objects', async () => {
      const schema = variantAsync('type', [
        object({ type: literal('foo'), other: number() }),
        object({ type: literal('bar'), other: pipe(string(), email()) }),
        objectAsync({ type: literal('baz'), other: boolean() }),
      ]);
      type Schema = typeof schema;
      const input = { type: 'bar', other: 'hello' } as const;
      expect(
        await schema._run({ typed: false, value: input }, {})
      ).toStrictEqual({
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

    test('for nested typed objects', async () => {
      const schema = variantAsync('type', [
        object({ type: literal('foo'), other: number() }),
        variantAsync('type', [
          object({ type: literal('bar'), other: pipe(string(), email()) }),
          objectAsync({ type: literal('baz'), other: boolean() }),
        ]),
      ]);
      type Schema = typeof schema;
      const input = { type: 'bar', other: 'hello' } as const;
      expect(
        await schema._run({ typed: false, value: input }, {})
      ).toStrictEqual({
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

    test('for multiple typed objects', async () => {
      const schema = variantAsync('type', [
        object({ type: literal('foo'), other: number() }),
        object({ type: literal('foo'), other: pipe(string(), email()) }),
        object({ type: literal('foo'), other: pipe(string(), url()) }),
        object({ type: literal('foo'), other: pipe(string(), decimal()) }),
        objectAsync({ type: literal('foo'), other: boolean() }),
      ]);
      type Schema = typeof schema;
      const input = { type: 'foo', other: 'hello' } as const;
      expect(
        await schema._run({ typed: false, value: input }, {})
      ).toStrictEqual({
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

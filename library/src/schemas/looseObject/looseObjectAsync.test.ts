import { describe, expect, test } from 'vitest';
import type { FailureDataset, InferIssue } from '../../types/index.ts';
import {
  expectNoSchemaIssueAsync,
  expectSchemaIssueAsync,
} from '../../vitest/index.ts';
import { nullish } from '../nullish/index.ts';
import { number } from '../number/index.ts';
import { objectAsync } from '../object/index.ts';
import { optional } from '../optional/index.ts';
import { string, type StringIssue } from '../string/index.ts';
import {
  looseObjectAsync,
  type LooseObjectSchemaAsync,
} from './looseObjectAsync.ts';
import type { LooseObjectIssue } from './types.ts';

describe('looseObjectAsync', () => {
  describe('should return schema object', () => {
    const entries = { key: string() };
    type Entries = typeof entries;
    const baseSchema: Omit<
      LooseObjectSchemaAsync<Entries, never>,
      'message'
    > = {
      kind: 'schema',
      type: 'loose_object',
      reference: looseObjectAsync,
      expects: 'Object',
      entries,
      async: true,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: LooseObjectSchemaAsync<Entries, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(looseObjectAsync(entries)).toStrictEqual(schema);
      expect(looseObjectAsync(entries, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(looseObjectAsync(entries, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies LooseObjectSchemaAsync<Entries, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(looseObjectAsync(entries, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies LooseObjectSchemaAsync<Entries, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    test('for empty object', async () => {
      await expectNoSchemaIssueAsync(looseObjectAsync({}), [{}]);
    });

    test('for simple object', async () => {
      await expectNoSchemaIssueAsync(
        looseObjectAsync({ key1: string(), key2: number() }),
        [{ key1: 'foo', key2: 123 }]
      );
    });

    test('for unknown entries', async () => {
      await expectNoSchemaIssueAsync(
        looseObjectAsync({ key1: string(), key2: number() }),
        [{ key1: 'foo', key2: 123, other1: 'bar', other2: null }]
      );
    });
  });

  describe('should return dataset with issues', () => {
    const schema = looseObjectAsync({}, 'message');
    const baseIssue: Omit<LooseObjectIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'loose_object',
      expected: 'Object',
      message: 'message',
    };

    // Primitive types

    test('for bigints', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [-1n, 0n, 123n]);
    });

    test('for booleans', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [true, false]);
    });

    test('for null', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [null]);
    });

    test('for numbers', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [-1, 0, 123, 45.67]);
    });

    test('for undefined', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [undefined]);
    });

    test('for strings', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, ['', 'abc', '123']);
    });

    test('for symbols', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [
        Symbol(),
        Symbol('foo'),
      ]);
    });

    // Complex types

    // TODO: Enable this test again in case we find a reliable way to check for
    // plain objects
    // test('for arrays', async () => {
    //   await expectSchemaIssueAsync(schema, baseIssue, [[], ['value']]);
    // });

    test('for functions', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [
        () => {},
        function () {},
      ]);
    });
  });

  describe('should return dataset without nested issues', () => {
    test('for simple object', async () => {
      await expectNoSchemaIssueAsync(
        looseObjectAsync({ key1: string(), key2: number() }),
        [{ key1: 'foo', key2: 123 }]
      );
    });

    test('for nested object', async () => {
      await expectNoSchemaIssueAsync(
        looseObjectAsync({ nested: objectAsync({ key: string() }) }),
        [{ nested: { key: 'foo' } }]
      );
    });

    test('for optional entry', async () => {
      await expectNoSchemaIssueAsync(
        looseObjectAsync({ key: optional(string()) }),
        [
          {},
          // @ts-expect-error
          { key: undefined },
          { key: 'foo' },
        ]
      );
    });

    test('for nullish entry', async () => {
      await expectNoSchemaIssueAsync(
        looseObjectAsync({ key: nullish(number()) }),
        [{}, { key: undefined }, { key: null }, { key: 123 }]
      );
    });

    test('for unknown entries', async () => {
      await expectNoSchemaIssueAsync(
        looseObjectAsync({ key1: string(), key2: number() }),
        [{ key1: 'foo', key2: 123, other1: 'bar', other2: null }]
      );
    });
  });

  describe('should return dataset with nested issues', () => {
    const schema = looseObjectAsync({
      key: string(),
      nested: objectAsync({ key: number() }),
    });

    const baseInfo = {
      message: expect.any(String),
      requirement: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    const stringIssue: StringIssue = {
      ...baseInfo,
      kind: 'schema',
      type: 'string',
      input: undefined,
      expected: 'string',
      received: 'undefined',
      path: [
        {
          type: 'object',
          origin: 'value',
          input: {},
          key: 'key',
          value: undefined,
        },
      ],
    };

    test('for missing entries', async () => {
      expect(await schema['~run']({ value: {} }, {})).toStrictEqual({
        typed: false,
        value: {},
        issues: [
          stringIssue,
          {
            ...baseInfo,
            kind: 'schema',
            type: 'object',
            input: undefined,
            expected: 'Object',
            received: 'undefined',
            path: [
              {
                type: 'object',
                origin: 'value',
                input: {},
                key: 'nested',
                value: undefined,
              },
            ],
          },
        ],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('for missing nested entries', async () => {
      const input = { key: 'value', nested: {} };
      expect(await schema['~run']({ value: input }, {})).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'number',
            input: undefined,
            expected: 'number',
            received: 'undefined',
            path: [
              {
                type: 'object',
                origin: 'value',
                input: { key: 'value', nested: {} },
                key: 'nested',
                value: {},
              },
              {
                type: 'object',
                origin: 'value',
                input: {},
                key: 'key',
                value: undefined,
              },
            ],
          },
        ],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('with abort early', async () => {
      expect(
        await schema['~run']({ value: {} }, { abortEarly: true })
      ).toStrictEqual({
        typed: false,
        value: {},
        issues: [{ ...stringIssue, abortEarly: true }],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });
  });
});

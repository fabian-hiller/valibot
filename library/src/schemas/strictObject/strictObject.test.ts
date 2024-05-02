import { describe, expect, test } from 'vitest';
import type { InferIssue, UntypedDataset } from '../../types/index.ts';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import { nullish } from '../nullish/index.ts';
import { number } from '../number/index.ts';
import { object } from '../object/index.ts';
import { optional } from '../optional/index.ts';
import { string, type StringIssue } from '../string/index.ts';
import { strictObject, type StrictObjectSchema } from './strictObject.ts';
import type { StrictObjectIssue } from './types.ts';

describe('strictObject', () => {
  describe('should return schema object', () => {
    const entries = { key: string() };
    type Entries = typeof entries;
    const baseSchema: Omit<
      StrictObjectSchema<Entries, never>,
      'message' | 'rest'
    > = {
      kind: 'schema',
      type: 'strict_object',
      reference: strictObject,
      expects: 'Object',
      entries,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: StrictObjectSchema<Entries, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(strictObject(entries)).toStrictEqual(schema);
      expect(strictObject(entries, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(strictObject(entries, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies StrictObjectSchema<Entries, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(strictObject(entries, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies StrictObjectSchema<Entries, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    test('for empty object', () => {
      expectNoSchemaIssue(strictObject({}), [{}]);
    });

    test('for simple object', () => {
      expectNoSchemaIssue(strictObject({ key1: string(), key2: number() }), [
        { key1: 'foo', key2: 123 },
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = strictObject({}, 'message');
    const baseIssue: Omit<StrictObjectIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'strict_object',
      expected: 'Object',
      message: 'message',
    };

    // Primitive types

    test('for bigints', () => {
      expectSchemaIssue(schema, baseIssue, [-1n, 0n, 123n]);
    });

    test('for booleans', () => {
      expectSchemaIssue(schema, baseIssue, [true, false]);
    });

    test('for null', () => {
      expectSchemaIssue(schema, baseIssue, [null]);
    });

    test('for numbers', () => {
      expectSchemaIssue(schema, baseIssue, [-1, 0, 123, 45.67]);
    });

    test('for undefined', () => {
      expectSchemaIssue(schema, baseIssue, [undefined]);
    });

    test('for strings', () => {
      expectSchemaIssue(schema, baseIssue, ['', 'abc', '123']);
    });

    test('for symbols', () => {
      expectSchemaIssue(schema, baseIssue, [Symbol(), Symbol('foo')]);
    });

    // Complex types

    test('for arrays', () => {
      expectSchemaIssue(schema, baseIssue, [[], ['value']]);
    });

    test('for functions', () => {
      expectSchemaIssue(schema, baseIssue, [() => {}, function () {}]);
    });
  });

  describe('should return dataset without nested issues', () => {
    test('for simple object', () => {
      expectNoSchemaIssue(strictObject({ key1: string(), key2: number() }), [
        { key1: 'foo', key2: 123 },
      ]);
    });

    test('for nested object', () => {
      expectNoSchemaIssue(strictObject({ nested: object({ key: string() }) }), [
        { nested: { key: 'foo' } },
      ]);
    });

    test('for optional entry', () => {
      expectNoSchemaIssue(strictObject({ key: optional(string()) }), [
        {},
        { key: undefined },
        { key: 'foo' },
      ]);
    });

    test('for nullish entry', () => {
      expectNoSchemaIssue(strictObject({ key: nullish(number()) }), [
        {},
        { key: undefined },
        { key: null },
        { key: 123 },
      ]);
    });
  });

  describe('should return dataset with nested issues', () => {
    const schema = strictObject({
      key: string(),
      nested: object({ key: number() }),
    });

    const baseInfo = {
      message: expect.any(String),
      requirement: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
      skipPipe: undefined,
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

    test('for missing entries', () => {
      expect(schema._run({ typed: false, value: {} }, {})).toStrictEqual({
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
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('for missing nested entries', () => {
      const input = { key: 'value', nested: {} };
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
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
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('with abort early', () => {
      expect(
        schema._run({ typed: false, value: {} }, { abortEarly: true })
      ).toStrictEqual({
        typed: false,
        value: {},
        issues: [{ ...stringIssue, abortEarly: true }],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('for unknown entries', () => {
      const input = {
        key: 'foo',
        nested: { key: 123 },
        other1: 'foo',
        other2: 123,
      };
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: false,
        value: { key: input.key, nested: input.nested },
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'strict_object',
            input: input.other1,
            expected: 'never',
            received: `"${input.other1}"`,
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'other1',
                value: input.other1,
              },
            ],
          },
        ],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });
  });
});

import { describe, expect, test } from 'vitest';
import type { InferIssue, UntypedDataset } from '../../types/index.ts';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import { nullish } from '../nullish/index.ts';
import { number, type NumberIssue } from '../number/index.ts';
import { optional } from '../optional/index.ts';
import { string, type StringIssue } from '../string/index.ts';
import { object, type ObjectIssue, type ObjectSchema } from './object.ts';

describe('object', () => {
  describe('should return schema object', () => {
    const entries = { key: string() };
    type Entries = typeof entries;
    const baseSchema: Omit<ObjectSchema<Entries, never>, 'message'> = {
      kind: 'schema',
      type: 'object',
      expects: 'Object',
      entries,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: ObjectSchema<Entries, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(object(entries)).toStrictEqual(schema);
      expect(object(entries, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(object(entries, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies ObjectSchema<Entries, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(object(entries, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies ObjectSchema<Entries, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    test('for empty object', () => {
      expectNoSchemaIssue(object({}), [{}]);
    });

    test('for simple object', () => {
      expectNoSchemaIssue(object({ key1: string(), key2: number() }), [
        { key1: 'foo', key2: 123 },
      ]);
    });

    test('for unknown entries', () => {
      expect(
        object({ key1: string() })._run(
          { typed: false, value: { key1: 'foo', key2: 123, key3: null } },
          {}
        )
      ).toStrictEqual({
        typed: true,
        value: { key1: 'foo' },
      });
    });
  });

  describe('should return dataset with issues', () => {
    const schema = object({}, 'message');
    const baseIssue: Omit<ObjectIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'object',
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
      expectNoSchemaIssue(object({ key1: string(), key2: number() }), [
        { key1: 'foo', key2: 123 },
      ]);
    });

    test('for nested object', () => {
      expectNoSchemaIssue(object({ nested: object({ key: string() }) }), [
        { nested: { key: 'foo' } },
      ]);
    });

    test('for optional entry', () => {
      expectNoSchemaIssue(object({ key: optional(string()) }), [
        {},
        { key: undefined },
        { key: 'foo' },
      ]);
    });

    test('for nullish entry', () => {
      expectNoSchemaIssue(object({ key: nullish(number()) }), [
        {},
        { key: undefined },
        { key: null },
        { key: 123 },
      ]);
    });

    test('for unknown entries', () => {
      expect(
        object({ key1: string() })._run(
          { typed: false, value: { key1: 'foo', key2: 123, key3: null } },
          {}
        )
      ).toStrictEqual({
        typed: true,
        value: { key1: 'foo' },
      });
    });
  });

  describe('should return dataset with nested issues', () => {
    const schema = object({ key: string(), nested: object({ key: number() }) });

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

    const objectIssue: ObjectIssue = {
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
    };

    const numberIssue: NumberIssue = {
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
    };

    test('for missing entries', () => {
      expect(schema._run({ typed: false, value: {} }, {})).toStrictEqual({
        typed: false,
        value: {},
        issues: [stringIssue, objectIssue],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('for missing nested entries', () => {
      expect(
        schema._run({ typed: false, value: { key: 'value', nested: {} } }, {})
      ).toStrictEqual({
        typed: false,
        value: { key: 'value', nested: {} },
        issues: [numberIssue],
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
  });
});

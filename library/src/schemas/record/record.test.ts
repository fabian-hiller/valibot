import { describe, expect, test } from 'vitest';
import type { InferIssue, UntypedDataset } from '../../types/index.ts';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import { number, type NumberIssue } from '../number/index.ts';
import { optional } from '../optional/index.ts';
import { picklist } from '../picklist/index.ts';
import { string } from '../string/index.ts';
import { record, type RecordSchema } from './record.ts';
import type { RecordIssue } from './types.ts';

describe('record', () => {
  describe('should return schema record', () => {
    const key = string();
    type Key = typeof key;
    const value = number();
    type Value = typeof value;
    const baseSchema: Omit<RecordSchema<Key, Value, never>, 'message'> = {
      kind: 'schema',
      type: 'record',
      reference: record,
      expects: 'Object',
      key,
      value,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: RecordSchema<Key, Value, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(record(key, value)).toStrictEqual(schema);
      expect(record(key, value, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(record(key, value, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies RecordSchema<Key, Value, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(record(key, value, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies RecordSchema<Key, Value, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = record(string(), number());

    test('for empty record', () => {
      expectNoSchemaIssue(schema, [{}]);
    });

    test('for simple record', () => {
      expectNoSchemaIssue(schema, [{ foo: 1, bar: 2, baz: 3 }]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = record(string(), number(), 'message');
    const baseIssue: Omit<RecordIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'record',
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

    // TODO: Enable this test again in case we find a reliable way to check for
    // plain objects
    // test('for arrays', () => {
    //   expectSchemaIssue(schema, baseIssue, [[], ['value']]);
    // });

    test('for functions', () => {
      expectSchemaIssue(schema, baseIssue, [() => {}, function () {}]);
    });
  });

  describe('should return dataset without nested issues', () => {
    const schema = record(picklist(['foo', 'bar', 'baz']), optional(number()));

    test('for simple record', () => {
      expectNoSchemaIssue(schema, [{ foo: 1, bar: 2, baz: 3 }]);
    });

    test('for nested record', () => {
      expectNoSchemaIssue(record(string(), schema), [
        { foo: { foo: 1, bar: 2 }, bar: { baz: 3 } },
      ]);
    });
  });

  describe('should return dataset with nested issues', () => {
    const schema = record(picklist(['foo', 'bar', 'baz']), optional(number()));

    const baseInfo = {
      message: expect.any(String),
      requirement: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    const numberIssue1: NumberIssue = {
      ...baseInfo,
      kind: 'schema',
      type: 'number',
      input: '2',
      expected: 'number',
      received: '"2"',
      path: [
        {
          type: 'object',
          origin: 'value',
          input: {
            foo: 1,
            bar: '2',
            baz: undefined,
            other: 4,
          },
          key: 'bar',
          value: '2',
        },
      ],
    };

    test('for wrong values', () => {
      const input = {
        foo: 1,
        bar: '2',
        baz: undefined,
        other: 4,
      };
      expect(
        schema._run(
          {
            typed: false,
            value: input,
          },
          {}
        )
      ).toStrictEqual({
        typed: false,
        value: {
          foo: input.foo,
          bar: input.bar,
          baz: input.baz,
        },
        issues: [
          numberIssue1,
          {
            ...baseInfo,
            kind: 'schema',
            type: 'picklist',
            input: 'other',
            expected: '"foo" | "bar" | "baz"',
            received: '"other"',
            path: [
              {
                type: 'object',
                origin: 'key',
                input,
                key: 'other',
                value: 4,
              },
            ],
          },
        ],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('with abort early', () => {
      expect(
        schema._run(
          {
            typed: false,
            value: {
              foo: 1,
              bar: '2',
              baz: undefined,
              other: 4,
            },
          },
          { abortEarly: true }
        )
      ).toStrictEqual({
        typed: false,
        value: { foo: 1 },
        issues: [{ ...numberIssue1, abortEarly: true }],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('for wrong nested values', () => {
      const nestedSchema = record(string(), schema);
      const input = {
        key1: {
          foo: 1,
          bar: '2',
          baz: undefined,
        },
        key2: 123,
      };
      expect(
        nestedSchema._run({ typed: false, value: input }, {})
      ).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'number',
            input: input.key1.bar,
            expected: 'number',
            received: '"2"',
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'key1',
                value: input.key1,
              },
              {
                type: 'object',
                origin: 'value',
                input: input.key1,
                key: 'bar',
                value: input.key1.bar,
              },
            ],
          },
          {
            ...baseInfo,
            kind: 'schema',
            type: 'record',
            input: input.key2,
            expected: 'Object',
            received: '123',
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'key2',
                value: input.key2,
              },
            ],
          },
        ],
      } satisfies UntypedDataset<InferIssue<typeof nestedSchema>>);
    });
  });
});

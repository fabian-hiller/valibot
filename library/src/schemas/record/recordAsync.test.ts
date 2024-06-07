import { describe, expect, test } from 'vitest';
import type { InferIssue, UntypedDataset } from '../../types/index.ts';
import {
  expectNoSchemaIssueAsync,
  expectSchemaIssueAsync,
} from '../../vitest/index.ts';
import { number, type NumberIssue } from '../number/index.ts';
import { optionalAsync } from '../optional/index.ts';
import { picklist } from '../picklist/index.ts';
import { string } from '../string/index.ts';
import { recordAsync, type RecordSchemaAsync } from './recordAsync.ts';
import type { RecordIssue } from './types.ts';

describe('recordAsync', () => {
  describe('should return schema record', () => {
    const key = string();
    type Key = typeof key;
    const value = number();
    type Value = typeof value;
    const baseSchema: Omit<RecordSchemaAsync<Key, Value, never>, 'message'> = {
      kind: 'schema',
      type: 'record',
      reference: recordAsync,
      expects: 'Object',
      key,
      value,
      async: true,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: RecordSchemaAsync<Key, Value, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(recordAsync(key, value)).toStrictEqual(schema);
      expect(recordAsync(key, value, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(recordAsync(key, value, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies RecordSchemaAsync<Key, Value, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(recordAsync(key, value, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies RecordSchemaAsync<Key, Value, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = recordAsync(string(), number());

    test('for empty record', async () => {
      await expectNoSchemaIssueAsync(schema, [{}]);
    });

    test('for simple record', async () => {
      await expectNoSchemaIssueAsync(schema, [{ foo: 1, bar: 2, baz: 3 }]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = recordAsync(string(), number(), 'message');
    const baseIssue: Omit<RecordIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'record',
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
    const schema = recordAsync(
      picklist(['foo', 'bar', 'baz']),
      optionalAsync(number())
    );

    test('for simple record', async () => {
      await expectNoSchemaIssueAsync(schema, [{ foo: 1, bar: 2, baz: 3 }]);
    });

    test('for nested record', async () => {
      await expectNoSchemaIssueAsync(recordAsync(string(), schema), [
        { foo: { foo: 1, bar: 2 }, bar: { baz: 3 } },
      ]);
    });
  });

  describe('should return dataset with nested issues', () => {
    const schema = recordAsync(
      picklist(['foo', 'bar', 'baz']),
      optionalAsync(number())
    );

    const baseInfo = {
      message: expect.any(String),
      requirement: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
      skipPipe: undefined,
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
          type: 'record',
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

    test('for wrong values', async () => {
      const input = {
        foo: 1,
        bar: '2',
        baz: undefined,
        other: 4,
      };
      expect(
        await schema._run(
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
                type: 'record',
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

    test('with abort early', async () => {
      expect(
        await schema._run(
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

    test('for wrong nested values', async () => {
      const nestedSchema = recordAsync(string(), schema);
      const input = {
        key1: {
          foo: 1,
          bar: '2',
          baz: undefined,
        },
        key2: 123,
      };
      expect(
        await nestedSchema._run({ typed: false, value: input }, {})
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
                type: 'record',
                origin: 'value',
                input,
                key: 'key1',
                value: input.key1,
              },
              {
                type: 'record',
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
                type: 'record',
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

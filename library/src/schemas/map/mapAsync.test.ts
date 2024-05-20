import { describe, expect, test } from 'vitest';
import type { InferIssue, UntypedDataset } from '../../types/index.ts';
import {
  expectNoSchemaIssueAsync,
  expectSchemaIssueAsync,
} from '../../vitest/index.ts';
import { number } from '../number/index.ts';
import { string, type StringIssue } from '../string/index.ts';
import { mapAsync, type MapSchemaAsync } from './mapAsync.ts';
import type { MapIssue } from './types.ts';

describe('mapAsync', () => {
  describe('should return schema object', () => {
    const key = number();
    type Key = typeof key;
    const value = string();
    type Value = typeof value;
    const baseSchema: Omit<MapSchemaAsync<Key, Value, never>, 'message'> = {
      kind: 'schema',
      type: 'map',
      reference: mapAsync,
      expects: 'Map',
      key,
      value,
      async: true,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: MapSchemaAsync<Key, Value, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(mapAsync(key, value)).toStrictEqual(schema);
      expect(mapAsync(key, value, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(mapAsync(key, value, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies MapSchemaAsync<Key, Value, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(mapAsync(key, value, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies MapSchemaAsync<Key, Value, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = mapAsync(number(), string());

    test('for empty mapAsync', async () => {
      await expectNoSchemaIssueAsync(schema, [new Map()]);
    });

    test('for simple mapAsync', async () => {
      await expectNoSchemaIssueAsync(schema, [
        new Map([
          [0, 'foo'],
          [1, 'bar'],
          [2, 'baz'],
        ]),
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = mapAsync(number(), string(), 'message');
    const baseIssue: Omit<MapIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'map',
      expected: 'Map',
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

    test('for arrays', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [[], ['value']]);
    });

    test('for functions', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [
        () => {},
        function () {},
      ]);
    });

    test('for objects', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [{}, { key: 'value' }]);
    });
  });

  describe('should return dataset without nested issues', () => {
    const schema = mapAsync(number(), string());

    test('for simple mapAsync', async () => {
      await expectNoSchemaIssueAsync(schema, [
        new Map([
          [0, 'foo'],
          [1, 'bar'],
          [2, 'baz'],
        ]),
      ]);
    });

    test('for nested mapAsync', async () => {
      await expectNoSchemaIssueAsync(mapAsync(schema, schema), [
        new Map([
          [
            new Map([
              [0, 'foo'],
              [1, 'bar'],
            ]),
            new Map([[3, 'baz']]),
          ],
        ]),
      ]);
    });
  });

  describe('should return dataset with nested issues', () => {
    const schema = mapAsync(number(), string());

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
      input: 123,
      expected: 'string',
      received: '123',
      path: [
        {
          type: 'map',
          origin: 'value',
          input: new Map<unknown, unknown>([
            [0, 'foo'],
            [1, 123],
            [2, 'baz'],
            [null, 'bar'],
          ]),
          key: 1,
          value: 123,
        },
      ],
    };

    test('for wrong values', async () => {
      const input = new Map<unknown, unknown>([
        [0, 'foo'],
        [1, 123],
        [2, 'baz'],
        [null, 'bar'],
      ]);
      expect(
        await schema._run({ typed: false, value: input }, {})
      ).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          stringIssue,
          {
            ...baseInfo,
            kind: 'schema',
            type: 'number',
            input: null,
            expected: 'number',
            received: 'null',
            path: [
              {
                type: 'map',
                origin: 'key',
                input,
                key: null,
                value: 'bar',
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
            value: new Map<unknown, unknown>([
              [0, 'foo'],
              [1, 123],
              [2, 'baz'],
              [null, 'bar'],
            ]),
          },
          { abortEarly: true }
        )
      ).toStrictEqual({
        typed: false,
        value: new Map([[0, 'foo']]),
        issues: [{ ...stringIssue, abortEarly: true }],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('for wrong nested values', async () => {
      const nestedSchema = mapAsync(schema, schema);
      const input = new Map<unknown, unknown>([
        [
          new Map<unknown, unknown>([
            [0, 123],
            [1, 'foo'],
          ]),
          new Map(),
        ],
        [new Map(), 'bar'],
      ]);
      expect(
        await nestedSchema._run(
          {
            typed: false,
            value: input,
          },
          {}
        )
      ).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'string',
            input: 123,
            expected: 'string',
            received: '123',
            path: [
              {
                type: 'map',
                origin: 'key',
                input,
                key: new Map<unknown, unknown>([
                  [0, 123],
                  [1, 'foo'],
                ]),
                value: new Map(),
              },
              {
                type: 'map',
                origin: 'value',
                input: new Map<unknown, unknown>([
                  [0, 123],
                  [1, 'foo'],
                ]),
                key: 0,
                value: 123,
              },
            ],
          },
          {
            ...baseInfo,
            kind: 'schema',
            type: 'map',
            input: 'bar',
            expected: 'Map',
            received: '"bar"',
            path: [
              {
                type: 'map',
                origin: 'value',
                input,
                key: new Map(),
                value: 'bar',
              },
            ],
          },
        ],
      } satisfies UntypedDataset<InferIssue<typeof nestedSchema>>);
    });
  });
});

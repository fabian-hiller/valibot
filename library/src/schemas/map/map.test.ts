import { describe, expect, test } from 'vitest';
import type { FailureDataset, InferIssue } from '../../types/index.ts';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import { number } from '../number/index.ts';
import { string, type StringIssue } from '../string/index.ts';
import { map, type MapSchema } from './map.ts';
import type { MapIssue } from './types.ts';

describe('map', () => {
  describe('should return schema object', () => {
    const key = number();
    type Key = typeof key;
    const value = string();
    type Value = typeof value;
    const baseSchema: Omit<MapSchema<Key, Value, never>, 'message'> = {
      kind: 'schema',
      type: 'map',
      reference: map,
      expects: 'Map',
      key,
      value,
      async: false,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: MapSchema<Key, Value, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(map(key, value)).toStrictEqual(schema);
      expect(map(key, value, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(map(key, value, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies MapSchema<Key, Value, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(map(key, value, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies MapSchema<Key, Value, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = map(number(), string());

    test('for empty map', () => {
      expectNoSchemaIssue(schema, [new Map()]);
    });

    test('for simple map', () => {
      expectNoSchemaIssue(schema, [
        new Map([
          [0, 'foo'],
          [1, 'bar'],
          [2, 'baz'],
        ]),
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = map(number(), string(), 'message');
    const baseIssue: Omit<MapIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'map',
      expected: 'Map',
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

    test('for objects', () => {
      expectSchemaIssue(schema, baseIssue, [{}, { key: 'value' }]);
    });
  });

  describe('should return dataset without nested issues', () => {
    const schema = map(number(), string());

    test('for simple map', () => {
      expectNoSchemaIssue(schema, [
        new Map([
          [0, 'foo'],
          [1, 'bar'],
          [2, 'baz'],
        ]),
      ]);
    });

    test('for nested map', () => {
      expectNoSchemaIssue(map(schema, schema), [
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
    const schema = map(number(), string());

    const baseInfo = {
      message: expect.any(String),
      requirement: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    const input = new Map<unknown, unknown>([
      [0, 'foo'],
      [1, 123], // Invalid value
      [2, 'baz'],
      [null, 'bar'], // Invalid key
      [4, null], // Invalid value
    ]);

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
          input,
          key: 1,
          value: 123,
        },
      ],
    };

    test('for invalid values', () => {
      expect(schema['~run']({ value: input }, {})).toStrictEqual({
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
          {
            ...baseInfo,
            kind: 'schema',
            type: 'string',
            input: null,
            expected: 'string',
            received: 'null',
            path: [
              {
                type: 'map',
                origin: 'value',
                input,
                key: 4,
                value: null,
              },
            ],
          },
        ],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('with abort early for invalid key', () => {
      const input = new Map<unknown, unknown>([
        [0, 'foo'],
        ['1', 'bar'], // Invalid key
        [2, 'baz'],
        [3, 123], // Invalid value
      ]);
      expect(
        schema['~run']({ value: input }, { abortEarly: true })
      ).toStrictEqual({
        typed: false,
        value: new Map([[0, 'foo']]),
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'number',
            input: '1',
            expected: 'number',
            received: '"1"',
            path: [
              {
                type: 'map',
                origin: 'key',
                input,
                key: '1',
                value: 'bar',
              },
            ],
            abortEarly: true,
          },
        ],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('with abort early for invalid value', () => {
      expect(
        schema['~run']({ value: input }, { abortEarly: true })
      ).toStrictEqual({
        typed: false,
        value: new Map([[0, 'foo']]),
        issues: [{ ...stringIssue, abortEarly: true }],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('for invalid nested values', () => {
      const nestedSchema = map(schema, schema);
      const input = new Map<unknown, unknown>([
        [
          new Map<unknown, unknown>([
            [0, 123],
            [1, 'foo'],
          ]),
          new Map(),
        ],
        [new Map(), 'bar'],
        [
          new Map(),
          new Map<unknown, unknown>([
            [0, 'foo'],
            ['1', 'bar'],
          ]),
        ],
      ]);
      expect(nestedSchema['~run']({ value: input }, {})).toStrictEqual({
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
          {
            ...baseInfo,
            kind: 'schema',
            type: 'number',
            input: '1',
            expected: 'number',
            received: '"1"',
            path: [
              {
                type: 'map',
                origin: 'value',
                input,
                key: new Map(),
                value: new Map<unknown, unknown>([
                  [0, 'foo'],
                  ['1', 'bar'],
                ]),
              },
              {
                type: 'map',
                origin: 'key',
                input: new Map<unknown, unknown>([
                  [0, 'foo'],
                  ['1', 'bar'],
                ]),
                key: '1',
                value: 'bar',
              },
            ],
          },
        ],
      } satisfies FailureDataset<InferIssue<typeof nestedSchema>>);
    });
  });
});

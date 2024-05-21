import { describe, expect, test } from 'vitest';
import type { InferIssue, UntypedDataset } from '../../types/index.ts';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import { string, type StringIssue } from '../string/index.ts';
import { array, type ArraySchema } from './array.ts';
import type { ArrayIssue } from './types.ts';

describe('array', () => {
  describe('should return schema object', () => {
    const item = string();
    type Item = typeof item;
    const baseSchema: Omit<ArraySchema<Item, never>, 'message'> = {
      kind: 'schema',
      type: 'array',
      reference: array,
      expects: 'Array',
      item,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: ArraySchema<Item, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(array(item)).toStrictEqual(schema);
      expect(array(item, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(array(item, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies ArraySchema<Item, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(array(item, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies ArraySchema<Item, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = array(string());

    test('for empty array', () => {
      expectNoSchemaIssue(schema, [[]]);
    });

    test('for simple array', () => {
      expectNoSchemaIssue(schema, [['foo', 'bar', 'baz']]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = array(string(), 'message');
    const baseIssue: Omit<ArrayIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'array',
      expected: 'Array',
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

    test('for functions', () => {
      expectSchemaIssue(schema, baseIssue, [() => {}, function () {}]);
    });

    test('for objects', () => {
      expectSchemaIssue(schema, baseIssue, [{}, { key: 'value' }]);
    });
  });

  describe('should return dataset without nested issues', () => {
    const schema = array(string());

    test('for simple array', () => {
      expectNoSchemaIssue(schema, [['foo', 'bar', 'baz']]);
    });

    test('for nested array', () => {
      expectNoSchemaIssue(array(schema), [[['foo', 'bar'], ['baz']]]);
    });
  });

  describe('should return dataset with nested issues', () => {
    const schema = array(string());

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
          type: 'array',
          origin: 'value',
          input: ['foo', 123, 'baz', null],
          key: 1,
          value: 123,
        },
      ],
    };

    test('for wrong items', () => {
      expect(
        schema._run({ typed: false, value: ['foo', 123, 'baz', null] }, {})
      ).toStrictEqual({
        typed: false,
        value: ['foo', 123, 'baz', null],
        issues: [
          stringIssue,
          {
            ...baseInfo,
            kind: 'schema',
            type: 'string',
            input: null,
            expected: 'string',
            received: 'null',
            path: [
              {
                type: 'array',
                origin: 'value',
                input: ['foo', 123, 'baz', null],
                key: 3,
                value: null,
              },
            ],
          },
        ],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('with abort early', () => {
      expect(
        schema._run(
          { typed: false, value: ['foo', 123, 'baz', null] },
          { abortEarly: true }
        )
      ).toStrictEqual({
        typed: false,
        value: ['foo'],
        issues: [{ ...stringIssue, abortEarly: true }],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('for wrong nested items', () => {
      const nestedSchema = array(schema);
      expect(
        nestedSchema._run(
          { typed: false, value: [[123, 'foo'], 'bar', []] },
          {}
        )
      ).toStrictEqual({
        typed: false,
        value: [[123, 'foo'], 'bar', []],
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
                type: 'array',
                origin: 'value',
                input: [[123, 'foo'], 'bar', []],
                key: 0,
                value: [123, 'foo'],
              },
              {
                type: 'array',
                origin: 'value',
                input: [123, 'foo'],
                key: 0,
                value: 123,
              },
            ],
          },
          {
            ...baseInfo,
            kind: 'schema',
            type: 'array',
            input: 'bar',
            expected: 'Array',
            received: '"bar"',
            path: [
              {
                type: 'array',
                origin: 'value',
                input: [[123, 'foo'], 'bar', []],
                key: 1,
                value: 'bar',
              },
            ],
          },
        ],
      } satisfies UntypedDataset<InferIssue<typeof nestedSchema>>);
    });
  });
});

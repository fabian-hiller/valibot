import { describe, expect, test } from 'vitest';
import type { FailureDataset, InferIssue } from '../../types/index.ts';
import {
  expectNoSchemaIssueAsync,
  expectSchemaIssueAsync,
} from '../../vitest/index.ts';
import { string, type StringIssue } from '../string/index.ts';
import { arrayAsync, type ArraySchemaAsync } from './arrayAsync.ts';
import type { ArrayIssue } from './types.ts';

describe('array', () => {
  describe('should return schema object', () => {
    const item = string();
    type Item = typeof item;
    const baseSchema: Omit<ArraySchemaAsync<Item, never>, 'message'> = {
      kind: 'schema',
      type: 'array',
      reference: arrayAsync,
      expects: 'Array',
      item,
      async: true,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: ArraySchemaAsync<Item, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(arrayAsync(item)).toStrictEqual(schema);
      expect(arrayAsync(item, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(arrayAsync(item, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies ArraySchemaAsync<Item, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(arrayAsync(item, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies ArraySchemaAsync<Item, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = arrayAsync(string());

    test('for empty array', async () => {
      await expectNoSchemaIssueAsync(schema, [[]]);
    });

    test('for simple array', async () => {
      await expectNoSchemaIssueAsync(schema, [['foo', 'bar', 'baz']]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = arrayAsync(string(), 'message');
    const baseIssue: Omit<ArrayIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'array',
      expected: 'Array',
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
    const schema = arrayAsync(string());

    test('for simple array', async () => {
      await expectNoSchemaIssueAsync(schema, [['foo', 'bar', 'baz']]);
    });

    test('for nested array', async () => {
      await expectNoSchemaIssueAsync(arrayAsync(schema), [
        [['foo', 'bar'], ['baz']],
      ]);
    });
  });

  describe('should return dataset with nested issues', () => {
    const schema = arrayAsync(string());

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

    test('for wrong items', async () => {
      expect(
        await schema['~run']({ value: ['foo', 123, 'baz', null] }, {})
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
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('with abort early', async () => {
      expect(
        await schema['~run'](
          { value: ['foo', 123, 'baz', null] },
          { abortEarly: true }
        )
      ).toStrictEqual({
        typed: false,
        value: ['foo'],
        issues: [{ ...stringIssue, abortEarly: true }],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('for wrong nested items', async () => {
      const nestedSchema = arrayAsync(schema);
      expect(
        await nestedSchema['~run']({ value: [[123, 'foo'], 'bar', []] }, {})
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
      } satisfies FailureDataset<InferIssue<typeof nestedSchema>>);
    });
  });
});

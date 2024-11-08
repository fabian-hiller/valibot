import { describe, expect, test } from 'vitest';
import type { FailureDataset, InferIssue } from '../../types/index.ts';
import {
  expectNoSchemaIssueAsync,
  expectSchemaIssueAsync,
} from '../../vitest/index.ts';
import { string, type StringIssue } from '../string/index.ts';
import { setAsync, type SetSchemaAsync } from './setAsync.ts';
import type { SetIssue } from './types.ts';

describe('setAsync', () => {
  describe('should return schema object', () => {
    const value = string();
    type Value = typeof value;
    const baseSchema: Omit<SetSchemaAsync<Value, never>, 'message'> = {
      kind: 'schema',
      type: 'set',
      reference: setAsync,
      expects: 'Set',
      value,
      async: true,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: SetSchemaAsync<Value, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(setAsync(value)).toStrictEqual(schema);
      expect(setAsync(value, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(setAsync(value, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies SetSchemaAsync<Value, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(setAsync(value, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies SetSchemaAsync<Value, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = setAsync(string());

    test('for empty setAsync', async () => {
      await expectNoSchemaIssueAsync(schema, [new Set()]);
    });

    test('for simple setAsync', async () => {
      await expectNoSchemaIssueAsync(schema, [new Set(['foo', 'bar', 'baz'])]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = setAsync(string(), 'message');
    const baseIssue: Omit<SetIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'set',
      expected: 'Set',
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
    const schema = setAsync(string());

    test('for simple setAsync', async () => {
      await expectNoSchemaIssueAsync(schema, [new Set(['foo', 'bar', 'baz'])]);
    });

    test('for nested setAsync', async () => {
      await expectNoSchemaIssueAsync(setAsync(schema), [
        new Set([new Set(['foo', 'bar']), new Set(['baz'])]),
      ]);
    });
  });

  describe('should return dataset with nested issues', () => {
    const schema = setAsync(string());

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
          type: 'set',
          origin: 'value',
          input: new Set(['foo', 123, 'baz', null]),
          key: null,
          value: 123,
        },
      ],
    };

    test('for wrong values', async () => {
      expect(
        await schema['~run']({ value: new Set(['foo', 123, 'baz', null]) }, {})
      ).toStrictEqual({
        typed: false,
        value: new Set(['foo', 123, 'baz', null]),
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
                type: 'set',
                origin: 'value',
                input: new Set(['foo', 123, 'baz', null]),
                key: null,
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
          { value: new Set(['foo', 123, 'baz', null]) },
          { abortEarly: true }
        )
      ).toStrictEqual({
        typed: false,
        value: new Set(['foo']),
        issues: [{ ...stringIssue, abortEarly: true }],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('for wrong nested values', async () => {
      const nestedSchema = setAsync(schema);
      const input = new Set([new Set([123, 'foo']), 'bar', new Set()]);
      expect(await nestedSchema['~run']({ value: input }, {})).toStrictEqual({
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
                type: 'set',
                origin: 'value',
                input,
                key: null,
                value: new Set([123, 'foo']),
              },
              {
                type: 'set',
                origin: 'value',
                input: new Set([123, 'foo']),
                key: null,
                value: 123,
              },
            ],
          },
          {
            ...baseInfo,
            kind: 'schema',
            type: 'set',
            input: 'bar',
            expected: 'Set',
            received: '"bar"',
            path: [
              {
                type: 'set',
                origin: 'value',
                input,
                key: null,
                value: 'bar',
              },
            ],
          },
        ],
      } satisfies FailureDataset<InferIssue<typeof nestedSchema>>);
    });
  });
});

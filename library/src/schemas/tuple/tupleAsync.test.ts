import { describe, expect, test } from 'vitest';
import type { FailureDataset, InferIssue } from '../../types/index.ts';
import {
  expectNoSchemaIssueAsync,
  expectSchemaIssueAsync,
} from '../../vitest/index.ts';
import { boolean } from '../boolean/boolean.ts';
import { number } from '../number/index.ts';
import { optionalAsync } from '../optional/index.ts';
import { string, type StringIssue } from '../string/index.ts';
import { tupleAsync, type TupleSchemaAsync } from './tupleAsync.ts';
import type { TupleIssue } from './types.ts';

describe('tupleAsync', () => {
  describe('should return schema object', () => {
    const items = [optionalAsync(string()), number()] as const;
    type Items = typeof items;
    const baseSchema: Omit<TupleSchemaAsync<Items, never>, 'message'> = {
      kind: 'schema',
      type: 'tuple',
      reference: tupleAsync,
      expects: 'Array',
      items,
      async: true,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: TupleSchemaAsync<Items, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(tupleAsync(items)).toStrictEqual(schema);
      expect(tupleAsync(items, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(tupleAsync(items, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies TupleSchemaAsync<Items, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(tupleAsync(items, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies TupleSchemaAsync<Items, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    test('for empty tuple', async () => {
      await await expectNoSchemaIssueAsync(tupleAsync([]), [[]]);
    });

    const schema = tupleAsync([optionalAsync(string()), number()]);

    test('for simple tuple', async () => {
      await await expectNoSchemaIssueAsync(schema, [
        ['foo', 123],
        [undefined, 123],
      ]);
    });

    test('for unknown items', async () => {
      expect(
        await schema['~run']({ value: ['foo', 123, null, true, undefined] }, {})
      ).toStrictEqual({
        typed: true,
        value: ['foo', 123],
      });
    });
  });

  describe('should return dataset with issues', () => {
    const schema = tupleAsync([optionalAsync(string()), number()], 'message');
    const baseIssue: Omit<TupleIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'tuple',
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
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        function () {},
      ]);
    });

    test('for objects', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [{}, { key: 'value' }]);
    });
  });

  describe('should return dataset without nested issues', () => {
    const schema = tupleAsync([optionalAsync(string()), number()]);

    test('for simple tuple', async () => {
      await expectNoSchemaIssueAsync(schema, [
        ['foo', 123],
        [undefined, 123],
      ]);
    });

    test('for nested tuple', async () => {
      await expectNoSchemaIssueAsync(tupleAsync([schema, schema]), [
        [
          ['foo', 123],
          [undefined, 123],
        ],
      ]);
    });

    test('for unknown items', async () => {
      expect(
        await schema['~run']({ value: ['foo', 123, null, true, undefined] }, {})
      ).toStrictEqual({
        typed: true,
        value: ['foo', 123],
      });
    });
  });

  describe('should return dataset with nested issues', () => {
    const schema = tupleAsync([string(), number(), boolean()]);

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
          input: [123, 456, 'true'],
          key: 0,
          value: 123,
        },
      ],
    };

    test('for wrong items', async () => {
      const input = [123, 456, 'true'];
      expect(await schema['~run']({ value: input }, {})).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          stringIssue,
          {
            ...baseInfo,
            kind: 'schema',
            type: 'boolean',
            input: 'true',
            expected: 'boolean',
            received: '"true"',
            path: [
              {
                type: 'array',
                origin: 'value',
                input: input,
                key: 2,
                value: input[2],
              },
            ],
          },
        ],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('with abort early', async () => {
      expect(
        await schema['~run'](
          { value: [123, 456, 'true'] },
          { abortEarly: true }
        )
      ).toStrictEqual({
        typed: false,
        value: [],
        issues: [{ ...stringIssue, abortEarly: true }],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('for wrong nested items', async () => {
      const nestedSchema = tupleAsync([schema, schema]);
      const input: [[string, string, boolean], null] = [
        ['foo', '123', false],
        null,
      ];
      expect(await nestedSchema['~run']({ value: input }, {})).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'number',
            input: '123',
            expected: 'number',
            received: '"123"',
            path: [
              {
                type: 'array',
                origin: 'value',
                input: input,
                key: 0,
                value: input[0],
              },
              {
                type: 'array',
                origin: 'value',
                input: input[0],
                key: 1,
                value: input[0][1],
              },
            ],
          },
          {
            ...baseInfo,
            kind: 'schema',
            type: 'tuple',
            input: null,
            expected: 'Array',
            received: 'null',
            path: [
              {
                type: 'array',
                origin: 'value',
                input: input,
                key: 1,
                value: input[1],
              },
            ],
          },
        ],
      } satisfies FailureDataset<InferIssue<typeof nestedSchema>>);
    });
  });
});

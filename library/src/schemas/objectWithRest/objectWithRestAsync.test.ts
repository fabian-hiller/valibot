import { describe, expect, test } from 'vitest';
import type { FailureDataset, InferIssue } from '../../types/index.ts';
import {
  expectNoSchemaIssueAsync,
  expectSchemaIssueAsync,
} from '../../vitest/index.ts';
import { array } from '../array/array.ts';
import type { ArrayIssue } from '../array/types.ts';
import { boolean } from '../boolean/index.ts';
import { never } from '../never/index.ts';
import { nullish } from '../nullish/index.ts';
import { number } from '../number/index.ts';
import { object, objectAsync } from '../object/index.ts';
import { optional } from '../optional/index.ts';
import { string, type StringIssue } from '../string/index.ts';
import {
  objectWithRestAsync,
  type ObjectWithRestSchemaAsync,
} from './objectWithRestAsync.ts';
import type { ObjectWithRestIssue } from './types.ts';

describe('objectWithRestAsync', () => {
  describe('should return schema object', () => {
    const entries = { key: string() };
    type Entries = typeof entries;
    const rest = number();
    type Rest = typeof rest;
    const baseSchema: Omit<
      ObjectWithRestSchemaAsync<Entries, Rest, never>,
      'message'
    > = {
      kind: 'schema',
      type: 'object_with_rest',
      reference: objectWithRestAsync,
      expects: 'Object',
      entries,
      rest,
      async: true,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: ObjectWithRestSchemaAsync<Entries, Rest, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(objectWithRestAsync(entries, rest)).toStrictEqual(schema);
      expect(objectWithRestAsync(entries, rest, undefined)).toStrictEqual(
        schema
      );
    });

    test('with string message', () => {
      expect(objectWithRestAsync(entries, rest, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies ObjectWithRestSchemaAsync<Entries, Rest, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(objectWithRestAsync(entries, rest, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies ObjectWithRestSchemaAsync<Entries, Rest, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    test('for empty object', async () => {
      await expectNoSchemaIssueAsync(objectWithRestAsync({}, boolean()), [{}]);
    });

    test('for simple object', async () => {
      await expectNoSchemaIssueAsync(
        objectWithRestAsync({ key1: string(), key2: number() }, boolean()),
        // @ts-expect-error
        [{ key1: 'foo', key2: 123, other: true }]
      );
    });
  });

  describe('should return dataset with issues', () => {
    const schema = objectWithRestAsync({}, never(), 'message');
    const baseIssue: Omit<ObjectWithRestIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'object_with_rest',
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
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        function () {},
      ]);
    });
  });

  describe('should return dataset without nested issues', () => {
    test('for simple object', async () => {
      await expectNoSchemaIssueAsync(
        objectWithRestAsync({ key1: string(), key2: number() }, boolean()),
        // @ts-expect-error
        [{ key1: 'foo', key2: 123, other: true }]
      );
    });

    test('for nested object', async () => {
      await expectNoSchemaIssueAsync(
        objectWithRestAsync(
          { nested: object({ key: string() }) },
          objectAsync({ key: number() })
        ),
        // @ts-expect-error
        [{ nested: { key: 'foo' }, other: { key: 123 } }]
      );
    });

    test('for optional entry', async () => {
      await expectNoSchemaIssueAsync(
        objectWithRestAsync({ key: optional(string()) }, number()),
        // @ts-expect-error
        [{}, { key: undefined, other: 123 }, { key: 'foo' }]
      );
    });

    test('for nullish entry', async () => {
      await expectNoSchemaIssueAsync(
        objectWithRestAsync({ key: nullish(number()) }, number()),
        // @ts-expect-error
        [{}, { key: undefined, other: 123 }, { key: null }, { key: 123 }]
      );
    });
  });

  describe('should return dataset with nested issues', () => {
    const schema = objectWithRestAsync(
      {
        key: string(),
        nested: objectAsync({ key: number() }),
      },
      array(boolean())
    );

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

    test('for missing entries', async () => {
      expect(await schema['~run']({ value: {} }, {})).toStrictEqual({
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
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('for missing nested entries', async () => {
      const input = { key: 'value', nested: {} };
      expect(await schema['~run']({ value: input }, {})).toStrictEqual({
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
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('with abort early', async () => {
      expect(
        await schema['~run']({ value: {} }, { abortEarly: true })
      ).toStrictEqual({
        typed: false,
        value: {},
        issues: [{ ...stringIssue, abortEarly: true }],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    const arrayIssue: ArrayIssue = {
      ...baseInfo,
      kind: 'schema',
      type: 'array',
      input: null,
      expected: 'Array',
      received: 'null',
      path: [
        {
          type: 'object',
          origin: 'value',
          input: {
            key: 'foo',
            nested: { key: 123 },
            other1: null,
            other2: 'bar',
          },
          key: 'other1',
          value: null,
        },
      ],
    };

    test('for wrong rest', async () => {
      const input = {
        key: 'foo',
        nested: { key: 123 },
        other1: null,
        other2: 'bar',
      };
      expect(await schema['~run']({ value: input }, {})).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          arrayIssue,
          {
            ...baseInfo,
            kind: 'schema',
            type: 'array',
            input: 'bar',
            expected: 'Array',
            received: '"bar"',
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'other2',
                value: input.other2,
              },
            ],
          },
        ],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('for worng rest with abort early', async () => {
      expect(
        await schema['~run'](
          {
            value: {
              key: 'foo',
              nested: { key: 123 },
              other1: null,
              other2: 'bar',
            },
          },
          { abortEarly: true }
        )
      ).toStrictEqual({
        typed: false,
        value: {
          key: 'foo',
          nested: { key: 123 },
        },
        issues: [{ ...arrayIssue, abortEarly: true }],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('for wrong nested rest', async () => {
      const input = {
        key: 'foo',
        nested: { key: 123 },
        other: ['true'],
      };
      expect(await schema['~run']({ value: input }, {})).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'boolean',
            input: 'true',
            expected: 'boolean',
            received: '"true"',
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'other',
                value: input.other,
              },
              {
                type: 'array',
                origin: 'value',
                input: input.other,
                key: 0,
                value: input.other[0],
              },
            ],
          },
        ],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });
  });
});

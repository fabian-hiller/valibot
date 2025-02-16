import { describe, expect, test } from 'vitest';
import {
  boolean,
  nonOptionalAsync,
  nullishAsync,
  number,
  objectAsync,
  objectWithRestAsync,
  optional,
  optionalAsync,
  string,
} from '../../schemas/index.ts';
import type { FailureDataset, InferIssue } from '../../types/index.ts';
import { expectNoSchemaIssueAsync } from '../../vitest/index.ts';
import { requiredAsync } from './requiredAsync.ts';

describe('requiredAsync', () => {
  const entries = {
    key1: optional(string()),
    key2: optional(number()),
    key3: optionalAsync(string()),
    key4: nullishAsync(number(), async () => 123),
  };
  const baseInfo = {
    message: expect.any(String),
    requirement: undefined,
    issues: undefined,
    lang: undefined,
    abortEarly: undefined,
    abortPipeEarly: undefined,
  } as const;

  describe('objectAsync', () => {
    const wrapped = objectAsync(entries);
    const schema1 = requiredAsync(wrapped);
    const schema2 = requiredAsync(wrapped, ['key1', 'key3']);

    describe('should return schema object', () => {
      const baseObjectAsync = {
        kind: 'schema',
        type: 'object',
        reference: objectAsync,
        expects: 'Object',
        message: undefined,
        async: true,
        '~standard': {
          version: 1,
          vendor: 'valibot',
          validate: expect.any(Function),
        },
        '~run': expect.any(Function),
      } as const;

      test('with undefined keys and undefined message', () => {
        const expected: typeof schema1 = {
          ...baseObjectAsync,
          entries: {
            key1: {
              ...nonOptionalAsync(entries.key1),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key2: {
              ...nonOptionalAsync(entries.key2),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key3: {
              ...nonOptionalAsync(entries.key3),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key4: {
              ...nonOptionalAsync(entries.key4),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
          },
        };
        expect(schema1).toStrictEqual(expected);
        expect(schema1, undefined).toStrictEqual(expected);
      });

      test('with undefined keys and string message', () => {
        const message = 'message';
        const schema = requiredAsync(wrapped, message);
        expect(schema).toStrictEqual({
          ...baseObjectAsync,
          entries: {
            key1: {
              ...nonOptionalAsync(entries.key1, message),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key2: {
              ...nonOptionalAsync(entries.key2, message),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key3: {
              ...nonOptionalAsync(entries.key3, message),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key4: {
              ...nonOptionalAsync(entries.key4, message),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
          },
        } satisfies typeof schema);
      });

      test('with undefined keys and function message', () => {
        const message = () => 'message';
        const schema = requiredAsync(wrapped, message);
        expect(schema).toStrictEqual({
          ...baseObjectAsync,
          entries: {
            key1: {
              ...nonOptionalAsync(entries.key1, message),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key2: {
              ...nonOptionalAsync(entries.key2, message),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key3: {
              ...nonOptionalAsync(entries.key3, message),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key4: {
              ...nonOptionalAsync(entries.key4, message),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
          },
        } satisfies typeof schema);
      });

      test('with specific keys and undefined message', () => {
        const expected: typeof schema2 = {
          ...baseObjectAsync,
          entries: {
            key1: {
              ...nonOptionalAsync(entries.key1),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key2: entries.key2,
            key3: {
              ...nonOptionalAsync(entries.key3),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key4: entries.key4,
          },
        };
        expect(schema2).toStrictEqual(expected);
        expect(schema2, undefined).toStrictEqual(expected);
      });

      test('with specific keys and string message', () => {
        const message = 'message';
        const schema = requiredAsync(wrapped, ['key1', 'key3'], message);
        expect(schema).toStrictEqual({
          ...baseObjectAsync,
          entries: {
            key1: {
              ...nonOptionalAsync(entries.key1, message),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key2: entries.key2,
            key3: {
              ...nonOptionalAsync(entries.key3, message),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key4: entries.key4,
          },
        } satisfies typeof schema);
      });
    });

    describe('should return dataset without nested issues', () => {
      test('if required keys are present', async () => {
        const input1 = { key1: 'foo', key2: 123, key3: 'bar', key4: 123 };
        await expectNoSchemaIssueAsync(schema1, [input1]);
        await expectNoSchemaIssueAsync(schema2, [input1]);
        const input2 = { key1: 'foo', key3: 'bar' };
        expect(await schema2['~run']({ value: input2 }, {})).toStrictEqual({
          typed: true,
          value: { ...input2, key4: 123 },
        });
      });
    });

    describe('should return dataset with nested issues', () => {
      test('if required keys are missing', async () => {
        expect(await schema1['~run']({ value: {} }, {})).toStrictEqual({
          typed: false,
          value: {},
          issues: [
            {
              ...baseInfo,
              kind: 'schema',
              type: 'object',
              input: undefined,
              expected: '"key1"',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'key',
                  input: {},
                  key: 'key1',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfo,
              kind: 'schema',
              type: 'object',
              input: undefined,
              expected: '"key2"',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'key',
                  input: {},
                  key: 'key2',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfo,
              kind: 'schema',
              type: 'object',
              input: undefined,
              expected: '"key3"',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'key',
                  input: {},
                  key: 'key3',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfo,
              kind: 'schema',
              type: 'object',
              input: undefined,
              expected: '"key4"',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'key',
                  input: {},
                  key: 'key4',
                  value: undefined,
                },
              ],
            },
          ],
        } satisfies FailureDataset<InferIssue<typeof schema1>>);

        const input = { key2: 123, key4: null };
        expect(await schema2['~run']({ value: input }, {})).toStrictEqual({
          typed: false,
          value: { ...input, key4: 123 },
          issues: [
            {
              ...baseInfo,
              kind: 'schema',
              type: 'object',
              input: undefined,
              expected: '"key1"',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'key',
                  input,
                  key: 'key1',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfo,
              kind: 'schema',
              type: 'object',
              input: undefined,
              expected: '"key3"',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'key',
                  input,
                  key: 'key3',
                  value: undefined,
                },
              ],
            },
          ],
        } satisfies FailureDataset<InferIssue<typeof schema2>>);
      });

      test('if required keys are undefined', async () => {
        const input1 = {
          key1: undefined,
          key2: undefined,
          key3: undefined,
          key4: undefined,
        };
        expect(await schema1['~run']({ value: input1 }, {})).toStrictEqual({
          typed: false,
          value: input1,
          issues: [
            {
              ...baseInfo,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: input1,
                  key: 'key1',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfo,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: input1,
                  key: 'key2',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfo,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: input1,
                  key: 'key3',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfo,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: input1,
                  key: 'key4',
                  value: undefined,
                },
              ],
            },
          ],
        } satisfies FailureDataset<InferIssue<typeof schema1>>);

        const input2 = {
          key1: undefined,
          key2: 123,
          key3: undefined,
          key4: null,
        };
        expect(await schema2['~run']({ value: input2 }, {})).toStrictEqual({
          typed: false,
          value: { ...input2, key4: 123 },
          issues: [
            {
              ...baseInfo,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: input2,
                  key: 'key1',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfo,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: input2,
                  key: 'key3',
                  value: undefined,
                },
              ],
            },
          ],
        } satisfies FailureDataset<InferIssue<typeof schema2>>);
      });
    });
  });

  describe('objectWithRestAsync', () => {
    const rest = boolean();
    const wrapped = objectWithRestAsync(entries, rest);
    const schema1 = requiredAsync(wrapped);
    const schema2 = requiredAsync(wrapped, ['key2', 'key3']);

    describe('should return schema object', () => {
      const baseObjectWithRestAsync = {
        kind: 'schema',
        type: 'object_with_rest',
        reference: objectWithRestAsync,
        expects: 'Object',
        rest,
        message: undefined,
        async: true,
        '~standard': {
          version: 1,
          vendor: 'valibot',
          validate: expect.any(Function),
        },
        '~run': expect.any(Function),
      } as const;

      test('with undefined keys and undefined message', () => {
        const expected: typeof schema1 = {
          ...baseObjectWithRestAsync,
          entries: {
            key1: {
              ...nonOptionalAsync(entries.key1),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key2: {
              ...nonOptionalAsync(entries.key2),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key3: {
              ...nonOptionalAsync(entries.key3),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key4: {
              ...nonOptionalAsync(entries.key4),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
          },
        };
        expect(schema1).toStrictEqual(expected);
        expect(schema1, undefined).toStrictEqual(expected);
      });

      test('with undefined keys and string message', () => {
        const message = 'message';
        const schema = requiredAsync(wrapped, message);
        expect(schema).toStrictEqual({
          ...baseObjectWithRestAsync,
          entries: {
            key1: {
              ...nonOptionalAsync(entries.key1, message),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key2: {
              ...nonOptionalAsync(entries.key2, message),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key3: {
              ...nonOptionalAsync(entries.key3, message),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key4: {
              ...nonOptionalAsync(entries.key4, message),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
          },
          rest,
          message: undefined,
          async: true,
          '~standard': {
            version: 1,
            vendor: 'valibot',
            validate: expect.any(Function),
          },
          '~run': expect.any(Function),
        } satisfies typeof schema);
      });

      test('with undefined keys and function message', () => {
        const message = () => 'message';
        const schema = requiredAsync(wrapped, message);
        expect(schema).toStrictEqual({
          ...baseObjectWithRestAsync,
          entries: {
            key1: {
              ...nonOptionalAsync(entries.key1, message),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key2: {
              ...nonOptionalAsync(entries.key2, message),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key3: {
              ...nonOptionalAsync(entries.key3, message),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key4: {
              ...nonOptionalAsync(entries.key4, message),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
          },
        } satisfies typeof schema);
      });

      test('with specific keys und undefined message', () => {
        const expected: typeof schema2 = {
          ...baseObjectWithRestAsync,
          entries: {
            key1: entries.key1,
            key2: {
              ...nonOptionalAsync(entries.key2),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key3: {
              ...nonOptionalAsync(entries.key3),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key4: entries.key4,
          },
        };
        expect(schema2).toStrictEqual(expected);
        expect(schema2, undefined).toStrictEqual(expected);
      });

      test('with specific keys and string message', () => {
        const message = 'message';
        const schema = requiredAsync(wrapped, ['key2', 'key3'], message);
        expect(schema).toStrictEqual({
          ...baseObjectWithRestAsync,
          entries: {
            key1: entries.key1,
            key2: {
              ...nonOptionalAsync(entries.key2, message),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key3: {
              ...nonOptionalAsync(entries.key3, message),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key4: entries.key4,
          },
        } satisfies typeof schema);
      });

      test('with specific keys and function message', () => {
        const message = () => 'message';
        const schema = requiredAsync(wrapped, ['key2', 'key3'], message);
        expect(schema).toStrictEqual({
          ...baseObjectWithRestAsync,
          entries: {
            key1: entries.key1,
            key2: {
              ...nonOptionalAsync(entries.key2, message),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key3: {
              ...nonOptionalAsync(entries.key3, message),
              '~standard': {
                version: 1,
                vendor: 'valibot',
                validate: expect.any(Function),
              },
              '~run': expect.any(Function),
            },
            key4: entries.key4,
          },
        } satisfies typeof schema);
      });
    });

    describe('should return dataset without nested issues', () => {
      test('if required keys are present', async () => {
        const input1 = {
          key1: 'foo',
          key2: 123,
          key3: 'bar',
          key4: 123,
          other: true,
        };
        // @ts-expect-error
        await expectNoSchemaIssueAsync(schema1, [input1]);
        // @ts-expect-error
        await expectNoSchemaIssueAsync(schema2, [input1]);
        const input2 = { key2: 123, key3: 'bar', other: true };
        expect(await schema2['~run']({ value: input2 }, {})).toStrictEqual({
          typed: true,
          value: { ...input2, key4: 123 },
        });
      });
    });

    describe('should return dataset with nested issues', () => {
      test('if required keys are missing', async () => {
        expect(await schema1['~run']({ value: {} }, {})).toStrictEqual({
          typed: false,
          value: {},
          issues: [
            {
              ...baseInfo,
              kind: 'schema',
              type: 'object_with_rest',
              input: undefined,
              expected: '"key1"',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'key',
                  input: {},
                  key: 'key1',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfo,
              kind: 'schema',
              type: 'object_with_rest',
              input: undefined,
              expected: '"key2"',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'key',
                  input: {},
                  key: 'key2',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfo,
              kind: 'schema',
              type: 'object_with_rest',
              input: undefined,
              expected: '"key3"',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'key',
                  input: {},
                  key: 'key3',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfo,
              kind: 'schema',
              type: 'object_with_rest',
              input: undefined,
              expected: '"key4"',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'key',
                  input: {},
                  key: 'key4',
                  value: undefined,
                },
              ],
            },
          ],
        } satisfies FailureDataset<InferIssue<typeof schema1>>);

        const input = { key1: 'foo', key4: null, other: true };
        expect(await schema2['~run']({ value: input }, {})).toStrictEqual({
          typed: false,
          value: { ...input, key4: 123 },
          issues: [
            {
              ...baseInfo,
              kind: 'schema',
              type: 'object_with_rest',
              input: undefined,
              expected: '"key2"',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'key',
                  input,
                  key: 'key2',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfo,
              kind: 'schema',
              type: 'object_with_rest',
              input: undefined,
              expected: '"key3"',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'key',
                  input,
                  key: 'key3',
                  value: undefined,
                },
              ],
            },
          ],
        } satisfies FailureDataset<InferIssue<typeof schema2>>);
      });

      test('if required keys are undefined', async () => {
        const input1 = {
          key1: undefined,
          key2: undefined,
          key3: undefined,
          key4: undefined,
        };
        expect(await schema1['~run']({ value: input1 }, {})).toStrictEqual({
          typed: false,
          value: input1,
          issues: [
            {
              ...baseInfo,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: input1,
                  key: 'key1',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfo,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: input1,
                  key: 'key2',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfo,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: input1,
                  key: 'key3',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfo,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: input1,
                  key: 'key4',
                  value: undefined,
                },
              ],
            },
          ],
        } satisfies FailureDataset<InferIssue<typeof schema1>>);

        const input2 = {
          key1: 'foo',
          key2: undefined,
          key3: undefined,
          key4: null,
          other: true,
        };
        expect(await schema2['~run']({ value: input2 }, {})).toStrictEqual({
          typed: false,
          value: { ...input2, key4: 123 },
          issues: [
            {
              ...baseInfo,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: input2,
                  key: 'key2',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfo,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: input2,
                  key: 'key3',
                  value: undefined,
                },
              ],
            },
          ],
        } satisfies FailureDataset<InferIssue<typeof schema2>>);
      });
    });
  });
});

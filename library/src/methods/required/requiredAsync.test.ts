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
    requirement: undefined,
    issues: undefined,
    lang: undefined,
    abortEarly: undefined,
    abortPipeEarly: undefined,
  } as const;
  const baseInfoWithAnyMsg = {
    ...baseInfo,
    message: expect.any(String),
  } as const;

  describe('objectAsync', () => {
    const wrapped = objectAsync(entries);
    const schema1 = requiredAsync(wrapped);
    const schema1ErrMsg = 'custom error message 1';
    const schema1WithMsg = requiredAsync(wrapped, schema1ErrMsg);
    const schema2 = requiredAsync(wrapped, ['key1', 'key3']);
    const schema2ErrMsg = 'custom error message 2';
    const schema2WithMsg = requiredAsync(
      wrapped,
      ['key1', 'key3'],
      schema2ErrMsg
    );

    describe('should return schema object', () => {
      test('with undefined keys', () => {
        expect(schema1).toStrictEqual({
          kind: 'schema',
          type: 'object',
          reference: objectAsync,
          expects: 'Object',
          entries: {
            key1: {
              ...nonOptionalAsync(entries.key1),
              '~validate': expect.any(Function),
            },
            key2: {
              ...nonOptionalAsync(entries.key2),
              '~validate': expect.any(Function),
            },
            key3: {
              ...nonOptionalAsync(entries.key3),
              '~validate': expect.any(Function),
            },
            key4: {
              ...nonOptionalAsync(entries.key4),
              '~validate': expect.any(Function),
            },
          },
          message: undefined,
          async: true,
          '~standard': 1,
          '~vendor': 'valibot',
          '~validate': expect.any(Function),
        } satisfies typeof schema1);
      });

      test('with undefined keys and custom required message', () => {
        expect(schema1WithMsg).toStrictEqual({
          kind: 'schema',
          type: 'object',
          reference: objectAsync,
          expects: 'Object',
          entries: {
            key1: {
              ...nonOptionalAsync(entries.key1, schema1ErrMsg),
              '~validate': expect.any(Function),
            },
            key2: {
              ...nonOptionalAsync(entries.key2, schema1ErrMsg),
              '~validate': expect.any(Function),
            },
            key3: {
              ...nonOptionalAsync(entries.key3, schema1ErrMsg),
              '~validate': expect.any(Function),
            },
            key4: {
              ...nonOptionalAsync(entries.key4, schema1ErrMsg),
              '~validate': expect.any(Function),
            },
          },
          message: undefined,
          async: true,
          '~standard': 1,
          '~vendor': 'valibot',
          '~validate': expect.any(Function),
        } satisfies typeof schema1WithMsg);
      });

      test('with specific keys', () => {
        expect(schema2).toStrictEqual({
          kind: 'schema',
          type: 'object',
          reference: objectAsync,
          expects: 'Object',
          entries: {
            key1: {
              ...nonOptionalAsync(entries.key1),
              '~validate': expect.any(Function),
            },
            key2: entries.key2,
            key3: {
              ...nonOptionalAsync(entries.key3),
              '~validate': expect.any(Function),
            },
            key4: entries.key4,
          },
          message: undefined,
          async: true,
          '~standard': 1,
          '~vendor': 'valibot',
          '~validate': expect.any(Function),
        } satisfies typeof schema2);
      });

      test('with specific keys and custom required message', () => {
        expect(schema2WithMsg).toStrictEqual({
          kind: 'schema',
          type: 'object',
          reference: objectAsync,
          expects: 'Object',
          entries: {
            key1: {
              ...nonOptionalAsync(entries.key1, schema2ErrMsg),
              '~validate': expect.any(Function),
            },
            key2: entries.key2,
            key3: {
              ...nonOptionalAsync(entries.key3, schema2ErrMsg),
              '~validate': expect.any(Function),
            },
            key4: entries.key4,
          },
          message: undefined,
          async: true,
          '~standard': 1,
          '~vendor': 'valibot',
          '~validate': expect.any(Function),
        } satisfies typeof schema2WithMsg);
      });
    });

    describe('should return dataset without nested issues', () => {
      test('if required keys are present', async () => {
        const input1 = { key1: 'foo', key2: 123, key3: 'bar', key4: 123 };
        await expectNoSchemaIssueAsync(schema1, [input1]);
        await expectNoSchemaIssueAsync(schema1WithMsg, [input1]);
        await expectNoSchemaIssueAsync(schema2, [input1]);
        await expectNoSchemaIssueAsync(schema2WithMsg, [input1]);
        const input2 = { key1: 'foo', key3: 'bar' };
        expect(await schema2['~validate']({ value: input2 }, {})).toStrictEqual(
          {
            typed: true,
            value: { ...input2, key4: 123 },
          }
        );
        expect(
          await schema2WithMsg['~validate']({ value: input2 }, {})
        ).toStrictEqual({
          typed: true,
          value: { ...input2, key4: 123 },
        });
      });
    });

    describe('should return dataset with nested issues', () => {
      test('if required keys are missing', async () => {
        expect(await schema1['~validate']({ value: {} }, {})).toStrictEqual({
          typed: false,
          value: {},
          issues: [
            {
              ...baseInfoWithAnyMsg,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: {},
                  key: 'key1',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfoWithAnyMsg,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: {},
                  key: 'key2',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfoWithAnyMsg,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: {},
                  key: 'key3',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfoWithAnyMsg,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: {},
                  key: 'key4',
                  value: undefined,
                },
              ],
            },
          ],
        } satisfies FailureDataset<InferIssue<typeof schema1>>);

        expect(
          await schema1WithMsg['~validate']({ value: {} }, {})
        ).toStrictEqual({
          typed: false,
          value: {},
          issues: [
            {
              ...baseInfo,
              message: schema1ErrMsg,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: {},
                  key: 'key1',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfo,
              message: schema1ErrMsg,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: {},
                  key: 'key2',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfo,
              message: schema1ErrMsg,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: {},
                  key: 'key3',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfo,
              message: schema1ErrMsg,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: {},
                  key: 'key4',
                  value: undefined,
                },
              ],
            },
          ],
        } satisfies FailureDataset<InferIssue<typeof schema1WithMsg>>);

        const input = { key2: 123, key4: null };

        expect(await schema2['~validate']({ value: input }, {})).toStrictEqual({
          typed: false,
          value: { ...input, key4: 123 },
          issues: [
            {
              ...baseInfoWithAnyMsg,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input,
                  key: 'key1',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfoWithAnyMsg,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input,
                  key: 'key3',
                  value: undefined,
                },
              ],
            },
          ],
        } satisfies FailureDataset<InferIssue<typeof schema2>>);

        expect(
          await schema2WithMsg['~validate']({ value: input }, {})
        ).toStrictEqual({
          typed: false,
          value: { ...input, key4: 123 },
          issues: [
            {
              ...baseInfo,
              message: schema2ErrMsg,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input,
                  key: 'key1',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfo,
              message: schema2ErrMsg,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input,
                  key: 'key3',
                  value: undefined,
                },
              ],
            },
          ],
        } satisfies FailureDataset<InferIssue<typeof schema2WithMsg>>);
      });
    });
  });

  describe('objectWithRestAsync', () => {
    const rest = boolean();
    const wrapped = objectWithRestAsync(entries, rest);
    const schema1 = requiredAsync(wrapped);
    const schema1ErrMsg = 'custom error message 1';
    const schema1WithMsg = requiredAsync(wrapped, schema1ErrMsg);
    const schema2 = requiredAsync(wrapped, ['key2', 'key3']);
    const schema2ErrMsg = 'custom error message 2';
    const schema2WithMsg = requiredAsync(
      wrapped,
      ['key2', 'key3'],
      schema2ErrMsg
    );

    describe('should return schema object', () => {
      test('with undefined keys', () => {
        expect(schema1).toStrictEqual({
          kind: 'schema',
          type: 'object_with_rest',
          reference: objectWithRestAsync,
          expects: 'Object',
          entries: {
            key1: {
              ...nonOptionalAsync(entries.key1),
              '~validate': expect.any(Function),
            },
            key2: {
              ...nonOptionalAsync(entries.key2),
              '~validate': expect.any(Function),
            },
            key3: {
              ...nonOptionalAsync(entries.key3),
              '~validate': expect.any(Function),
            },
            key4: {
              ...nonOptionalAsync(entries.key4),
              '~validate': expect.any(Function),
            },
          },
          rest,
          message: undefined,
          async: true,
          '~standard': 1,
          '~vendor': 'valibot',
          '~validate': expect.any(Function),
        } satisfies typeof schema1);
      });

      test('with undefined keys and custom required message', () => {
        expect(schema1WithMsg).toStrictEqual({
          kind: 'schema',
          type: 'object_with_rest',
          reference: objectWithRestAsync,
          expects: 'Object',
          entries: {
            key1: {
              ...nonOptionalAsync(entries.key1, schema1ErrMsg),
              '~validate': expect.any(Function),
            },
            key2: {
              ...nonOptionalAsync(entries.key2, schema1ErrMsg),
              '~validate': expect.any(Function),
            },
            key3: {
              ...nonOptionalAsync(entries.key3, schema1ErrMsg),
              '~validate': expect.any(Function),
            },
            key4: {
              ...nonOptionalAsync(entries.key4, schema1ErrMsg),
              '~validate': expect.any(Function),
            },
          },
          rest,
          message: undefined,
          async: true,
          '~standard': 1,
          '~vendor': 'valibot',
          '~validate': expect.any(Function),
        } satisfies typeof schema1WithMsg);
      });

      test('with specific keys', () => {
        expect(schema2).toStrictEqual({
          kind: 'schema',
          type: 'object_with_rest',
          reference: objectWithRestAsync,
          expects: 'Object',
          entries: {
            key1: entries.key1,
            key2: {
              ...nonOptionalAsync(entries.key2),
              '~validate': expect.any(Function),
            },
            key3: {
              ...nonOptionalAsync(entries.key3),
              '~validate': expect.any(Function),
            },
            key4: entries.key4,
          },
          rest,
          message: undefined,
          async: true,
          '~standard': 1,
          '~vendor': 'valibot',
          '~validate': expect.any(Function),
        } satisfies typeof schema2);
      });

      test('with specific keys and custom required message', () => {
        expect(schema2WithMsg).toStrictEqual({
          kind: 'schema',
          type: 'object_with_rest',
          reference: objectWithRestAsync,
          expects: 'Object',
          entries: {
            key1: entries.key1,
            key2: {
              ...nonOptionalAsync(entries.key2, schema2ErrMsg),
              '~validate': expect.any(Function),
            },
            key3: {
              ...nonOptionalAsync(entries.key3, schema2ErrMsg),
              '~validate': expect.any(Function),
            },
            key4: entries.key4,
          },
          rest,
          message: undefined,
          async: true,
          '~standard': 1,
          '~vendor': 'valibot',
          '~validate': expect.any(Function),
        } satisfies typeof schema2WithMsg);
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
        await expectNoSchemaIssueAsync(schema1WithMsg, [input1]);
        // @ts-expect-error
        await expectNoSchemaIssueAsync(schema2, [input1]);
        // @ts-expect-error
        await expectNoSchemaIssueAsync(schema2WithMsg, [input1]);
        const input2 = { key2: 123, key3: 'bar', other: true };
        expect(await schema2['~validate']({ value: input2 }, {})).toStrictEqual(
          {
            typed: true,
            value: { ...input2, key4: 123 },
          }
        );
        expect(
          await schema2WithMsg['~validate']({ value: input2 }, {})
        ).toStrictEqual({
          typed: true,
          value: { ...input2, key4: 123 },
        });
      });
    });

    describe('should return dataset with nested issues', () => {
      test('if required keys are missing', async () => {
        expect(await schema1['~validate']({ value: {} }, {})).toStrictEqual({
          typed: false,
          value: {},
          issues: [
            {
              ...baseInfoWithAnyMsg,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: {},
                  key: 'key1',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfoWithAnyMsg,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: {},
                  key: 'key2',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfoWithAnyMsg,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: {},
                  key: 'key3',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfoWithAnyMsg,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: {},
                  key: 'key4',
                  value: undefined,
                },
              ],
            },
          ],
        } satisfies FailureDataset<InferIssue<typeof schema1>>);

        expect(
          await schema1WithMsg['~validate']({ value: {} }, {})
        ).toStrictEqual({
          typed: false,
          value: {},
          issues: [
            {
              ...baseInfo,
              message: schema1ErrMsg,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: {},
                  key: 'key1',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfo,
              message: schema1ErrMsg,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: {},
                  key: 'key2',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfo,
              message: schema1ErrMsg,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: {},
                  key: 'key3',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfo,
              message: schema1ErrMsg,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: {},
                  key: 'key4',
                  value: undefined,
                },
              ],
            },
          ],
        } satisfies FailureDataset<InferIssue<typeof schema1WithMsg>>);

        const input = { key1: 'foo', key4: null, other: true };

        expect(await schema2['~validate']({ value: input }, {})).toStrictEqual({
          typed: false,
          value: { ...input, key4: 123 },
          issues: [
            {
              ...baseInfoWithAnyMsg,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input,
                  key: 'key2',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfoWithAnyMsg,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input,
                  key: 'key3',
                  value: undefined,
                },
              ],
            },
          ],
        } satisfies FailureDataset<InferIssue<typeof schema2>>);

        expect(
          await schema2WithMsg['~validate']({ value: input }, {})
        ).toStrictEqual({
          typed: false,
          value: { ...input, key4: 123 },
          issues: [
            {
              ...baseInfo,
              message: schema2ErrMsg,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input,
                  key: 'key2',
                  value: undefined,
                },
              ],
            },
            {
              ...baseInfo,
              message: schema2ErrMsg,
              kind: 'schema',
              type: 'non_optional',
              input: undefined,
              expected: '!undefined',
              received: 'undefined',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input,
                  key: 'key3',
                  value: undefined,
                },
              ],
            },
          ],
        } satisfies FailureDataset<InferIssue<typeof schema2WithMsg>>);
      });
    });
  });
});

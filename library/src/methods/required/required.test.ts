import { describe, expect, test } from 'vitest';
import {
  boolean,
  nonOptional,
  nullish,
  number,
  object,
  objectWithRest,
  optional,
  string,
} from '../../schemas/index.ts';
import type { FailureDataset, InferIssue } from '../../types/index.ts';
import { expectNoSchemaIssue } from '../../vitest/index.ts';
import { required } from './required.ts';

describe('required', () => {
  const entries = {
    key1: optional(string()),
    key2: optional(number()),
    key3: optional(string()),
    key4: nullish(number(), () => 123),
  };
  const baseInfo = {
    message: expect.any(String),
    requirement: undefined,
    issues: undefined,
    lang: undefined,
    abortEarly: undefined,
    abortPipeEarly: undefined,
  } as const;

  describe('object', () => {
    const wrapped = object(entries);
    const schema1 = required(wrapped);
    const schema2 = required(wrapped, ['key1', 'key3']);

    describe('should return schema object', () => {
      // TODO: Add test for every overload signature

      test('with undefined keys', () => {
        expect(schema1).toStrictEqual({
          kind: 'schema',
          type: 'object',
          reference: object,
          expects: 'Object',
          entries: {
            key1: {
              ...nonOptional(entries.key1),
              '~validate': expect.any(Function),
            },
            key2: {
              ...nonOptional(entries.key2),
              '~validate': expect.any(Function),
            },
            key3: {
              ...nonOptional(entries.key3),
              '~validate': expect.any(Function),
            },
            key4: {
              ...nonOptional(entries.key4),
              '~validate': expect.any(Function),
            },
          },
          message: undefined,
          async: false,
          '~standard': 1,
          '~vendor': 'valibot',
          '~validate': expect.any(Function),
        } satisfies typeof schema1);
      });

      test('with specific keys', () => {
        expect(schema2).toStrictEqual({
          kind: 'schema',
          type: 'object',
          reference: object,
          expects: 'Object',
          entries: {
            key1: {
              ...nonOptional(entries.key1),
              '~validate': expect.any(Function),
            },
            key2: entries.key2,
            key3: {
              ...nonOptional(entries.key3),
              '~validate': expect.any(Function),
            },
            key4: entries.key4,
          },
          message: undefined,
          async: false,
          '~standard': 1,
          '~vendor': 'valibot',
          '~validate': expect.any(Function),
        } satisfies typeof schema2);
      });
    });

    describe('should return dataset without nested issues', () => {
      test('if required keys are present', () => {
        const input1 = { key1: 'foo', key2: 123, key3: 'bar', key4: 123 };
        expectNoSchemaIssue(schema1, [input1]);
        expectNoSchemaIssue(schema2, [input1]);
        const input2 = { key1: 'foo', key3: 'bar' };
        expect(schema2['~validate']({ value: input2 }, {})).toStrictEqual({
          typed: true,
          value: { ...input2, key4: 123 },
        });
      });
    });

    describe('should return dataset with nested issues', () => {
      test('if requireded keys are missing', () => {
        expect(schema1['~validate']({ value: {} }, {})).toStrictEqual({
          typed: false,
          value: {},
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
                  input: {},
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
                  input: {},
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
                  input: {},
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
                  input: {},
                  key: 'key4',
                  value: undefined,
                },
              ],
            },
          ],
        } satisfies FailureDataset<InferIssue<typeof schema1>>);

        const input = { key2: 123, key4: null };
        expect(schema2['~validate']({ value: input }, {})).toStrictEqual({
          typed: false,
          value: { ...input, key4: 123 },
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
                  input,
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
                  input,
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

  describe('objectWithRest', () => {
    const rest = boolean();
    const wrapped = objectWithRest(entries, rest);
    const schema1 = required(wrapped);
    const schema2 = required(wrapped, ['key2', 'key3']);

    describe('should return schema object', () => {
      // TODO: Add test for every overload signature

      test('with undefined keys', () => {
        expect(schema1).toStrictEqual({
          kind: 'schema',
          type: 'object_with_rest',
          reference: objectWithRest,
          expects: 'Object',
          entries: {
            key1: {
              ...nonOptional(entries.key1),
              '~validate': expect.any(Function),
            },
            key2: {
              ...nonOptional(entries.key2),
              '~validate': expect.any(Function),
            },
            key3: {
              ...nonOptional(entries.key3),
              '~validate': expect.any(Function),
            },
            key4: {
              ...nonOptional(entries.key4),
              '~validate': expect.any(Function),
            },
          },
          rest,
          message: undefined,
          async: false,
          '~standard': 1,
          '~vendor': 'valibot',
          '~validate': expect.any(Function),
        } satisfies typeof schema1);
      });

      test('with specific keys', () => {
        expect(schema2).toStrictEqual({
          kind: 'schema',
          type: 'object_with_rest',
          reference: objectWithRest,
          expects: 'Object',
          entries: {
            key1: entries.key1,
            key2: {
              ...nonOptional(entries.key2),
              '~validate': expect.any(Function),
            },
            key3: {
              ...nonOptional(entries.key3),
              '~validate': expect.any(Function),
            },
            key4: entries.key4,
          },
          rest,
          message: undefined,
          async: false,
          '~standard': 1,
          '~vendor': 'valibot',
          '~validate': expect.any(Function),
        } satisfies typeof schema2);
      });
    });

    describe('should return dataset without nested issues', () => {
      test('if required keys are present', () => {
        const input1 = {
          key1: 'foo',
          key2: 123,
          key3: 'bar',
          key4: 123,
          other: true,
        };
        // @ts-expect-error
        expectNoSchemaIssue(schema1, [input1]);
        // @ts-expect-error
        expectNoSchemaIssue(schema2, [input1]);
        const input2 = { key2: 123, key3: 'bar', other: true };
        expect(schema2['~validate']({ value: input2 }, {})).toStrictEqual({
          typed: true,
          value: { ...input2, key4: 123 },
        });
      });
    });

    describe('should return dataset with nested issues', () => {
      test('if requireded keys are missing', () => {
        expect(schema1['~validate']({ value: {} }, {})).toStrictEqual({
          typed: false,
          value: {},
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
                  input: {},
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
                  input: {},
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
                  input: {},
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
                  input: {},
                  key: 'key4',
                  value: undefined,
                },
              ],
            },
          ],
        } satisfies FailureDataset<InferIssue<typeof schema1>>);

        const input = { key1: 'foo', key4: null, other: true };
        expect(schema2['~validate']({ value: input }, {})).toStrictEqual({
          typed: false,
          value: { ...input, key4: 123 },
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
                  input,
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
                  input,
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

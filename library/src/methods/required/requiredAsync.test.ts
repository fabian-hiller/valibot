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
import type { InferIssue, UntypedDataset } from '../../types/index.ts';
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
    skipPipe: undefined,
  } as const;

  describe('object', () => {
    const wrapped = objectAsync(entries);
    const schema1 = requiredAsync(wrapped);
    const schema2 = requiredAsync(wrapped, ['key1', 'key3']);

    describe('should return schema objectAsync', () => {
      // TODO: Add test for every overload signature

      test('with undefined keys', () => {
        expect(schema1).toStrictEqual({
          kind: 'schema',
          type: 'object',
          reference: objectAsync,
          expects: 'Object',
          entries: {
            key1: {
              ...nonOptionalAsync(entries.key1),
              _run: expect.any(Function),
            },
            key2: {
              ...nonOptionalAsync(entries.key2),
              _run: expect.any(Function),
            },
            key3: {
              ...nonOptionalAsync(entries.key3),
              _run: expect.any(Function),
            },
            key4: {
              ...nonOptionalAsync(entries.key4),
              _run: expect.any(Function),
            },
          },
          message: undefined,
          async: true,
          _run: expect.any(Function),
        } satisfies typeof schema1);
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
              _run: expect.any(Function),
            },
            key2: entries.key2,
            key3: {
              ...nonOptionalAsync(entries.key3),
              _run: expect.any(Function),
            },
            key4: entries.key4,
          },
          message: undefined,
          async: true,
          _run: expect.any(Function),
        } satisfies typeof schema2);
      });
    });

    describe('should return dataset without nested issues', () => {
      test('if requiredAsync keys are present', async () => {
        const input1 = { key1: 'foo', key2: 123, key3: 'bar', key4: 123 };
        await expectNoSchemaIssueAsync(schema1, [input1]);
        await expectNoSchemaIssueAsync(schema2, [input1]);
        const input2 = { key1: 'foo', key3: 'bar' };
        expect(
          await schema2._run({ typed: false, value: input2 }, {})
        ).toStrictEqual({
          typed: true,
          value: { ...input2, key4: 123 },
        });
      });
    });

    describe('should return dataset with nested issues', () => {
      test('if requireded keys are missing', async () => {
        expect(
          await schema1._run({ typed: false, value: {} }, {})
        ).toStrictEqual({
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
        } satisfies UntypedDataset<InferIssue<typeof schema1>>);

        const input = { key2: 123, key4: null };
        expect(
          await schema2._run({ typed: false, value: input }, {})
        ).toStrictEqual({
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
        } satisfies UntypedDataset<InferIssue<typeof schema2>>);
      });
    });
  });

  describe('objectWithRest', () => {
    const rest = boolean();
    const wrapped = objectWithRestAsync(entries, rest);
    const schema1 = requiredAsync(wrapped);
    const schema2 = requiredAsync(wrapped, ['key2', 'key3']);

    describe('should return schema objectAsync', () => {
      // TODO: Add test for every overload signature

      test('with undefined keys', () => {
        expect(schema1).toStrictEqual({
          kind: 'schema',
          type: 'object_with_rest',
          reference: objectWithRestAsync,
          expects: 'Object',
          entries: {
            key1: {
              ...nonOptionalAsync(entries.key1),
              _run: expect.any(Function),
            },
            key2: {
              ...nonOptionalAsync(entries.key2),
              _run: expect.any(Function),
            },
            key3: {
              ...nonOptionalAsync(entries.key3),
              _run: expect.any(Function),
            },
            key4: {
              ...nonOptionalAsync(entries.key4),
              _run: expect.any(Function),
            },
          },
          rest,
          message: undefined,
          async: true,
          _run: expect.any(Function),
        } satisfies typeof schema1);
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
              _run: expect.any(Function),
            },
            key3: {
              ...nonOptionalAsync(entries.key3),
              _run: expect.any(Function),
            },
            key4: entries.key4,
          },
          rest,
          message: undefined,
          async: true,
          _run: expect.any(Function),
        } satisfies typeof schema2);
      });
    });

    describe('should return dataset without nested issues', () => {
      test('if requiredAsync keys are present', async () => {
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
        expect(
          await schema2._run({ typed: false, value: input2 }, {})
        ).toStrictEqual({
          typed: true,
          value: { ...input2, key4: 123 },
        });
      });
    });

    describe('should return dataset with nested issues', () => {
      test('if requireded keys are missing', async () => {
        expect(
          await schema1._run({ typed: false, value: {} }, {})
        ).toStrictEqual({
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
        } satisfies UntypedDataset<InferIssue<typeof schema1>>);

        const input = { key1: 'foo', key4: null, other: true };
        expect(
          await schema2._run({ typed: false, value: input }, {})
        ).toStrictEqual({
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
        } satisfies UntypedDataset<InferIssue<typeof schema2>>);
      });
    });
  });
});

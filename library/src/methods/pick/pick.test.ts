import { describe, expect, test } from 'vitest';
import {
  boolean,
  type BooleanIssue,
  number,
  type NumberIssue,
  object,
  objectWithRest,
  string,
  type StringIssue,
} from '../../schemas/index.ts';
import type { FailureDataset, InferIssue } from '../../types/index.ts';
import { expectNoSchemaIssue } from '../../vitest/index.ts';
import { pick } from './pick.ts';

describe('pick', () => {
  const entries = {
    key1: string(),
    key2: number(),
    key3: string(),
    key4: number(),
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
    const schema = pick(object(entries), ['key1', 'key3']);

    test('should return schema object', () => {
      expect(schema).toStrictEqual({
        kind: 'schema',
        type: 'object',
        reference: object,
        expects: 'Object',
        entries: {
          key1: {
            ...string(),

            '~validate': expect.any(Function),
          },
          key3: {
            ...string(),

            '~validate': expect.any(Function),
          },
        },
        message: undefined,
        async: false,
        '~standard': 1,
        '~vendor': 'valibot',
        '~validate': expect.any(Function),
      } satisfies typeof schema);
    });

    describe('should return dataset without nested issues', () => {
      test('if picked keys are specified', () => {
        expectNoSchemaIssue(schema, [{ key1: 'foo', key3: 'bar' }]);
      });

      test('for unknown entries', () => {
        expect(
          schema['~validate'](
            { value: { key1: 'foo', key2: 123, key3: 'bar', other: null } },
            {}
          )
        ).toStrictEqual({
          typed: true,
          value: { key1: 'foo', key3: 'bar' },
        });
      });
    });

    describe('should return dataset with nested issues', () => {
      test('if a picked key is missing', () => {
        expect(
          schema['~validate']({ value: { key3: 'bar' } }, {})
        ).toStrictEqual({
          typed: false,
          value: { key3: 'bar' },
          issues: [
            {
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
                  input: { key3: 'bar' },
                  key: 'key1',
                  value: undefined,
                },
              ],
            } satisfies StringIssue,
          ],
        } satisfies FailureDataset<InferIssue<typeof schema>>);
      });
    });
  });

  describe('objectWithRest', () => {
    const schema = pick(objectWithRest(entries, boolean()), ['key2', 'key3']);

    test('should return schema object', () => {
      expect(schema).toStrictEqual({
        kind: 'schema',
        type: 'object_with_rest',
        reference: objectWithRest,
        expects: 'Object',
        entries: {
          key2: {
            ...number(),

            '~validate': expect.any(Function),
          },
          key3: {
            ...string(),

            '~validate': expect.any(Function),
          },
        },
        rest: {
          ...boolean(),
          '~validate': expect.any(Function),
        },
        message: undefined,
        async: false,
        '~standard': 1,
        '~vendor': 'valibot',
        '~validate': expect.any(Function),
      } satisfies typeof schema);
    });

    describe('should return dataset without nested issues', () => {
      test('if picked keys are specified', () => {
        // @ts-expect-error
        expectNoSchemaIssue(schema, [{ key2: 123, key3: 'bar' }]);
      });

      test('if not picked key matches rest', () => {
        // @ts-expect-error
        expectNoSchemaIssue(schema, [{ key1: false, key2: 123, key3: 'bar' }]);
      });
    });

    describe('should return dataset with nested issues', () => {
      test('if a picked key is missing', () => {
        expect(
          schema['~validate']({ value: { key3: 'foo' } }, {})
        ).toStrictEqual({
          typed: false,
          value: { key3: 'foo' },
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
                  input: { key3: 'foo' },
                  key: 'key2',
                  value: undefined,
                },
              ],
            } satisfies NumberIssue,
          ],
        } satisfies FailureDataset<InferIssue<typeof schema>>);
      });

      test('if a not picked key does not match rest', () => {
        expect(
          schema['~validate'](
            { value: { key1: 'foo', key2: 123, key3: 'foo' } },
            {}
          )
        ).toStrictEqual({
          typed: false,
          value: { key1: 'foo', key2: 123, key3: 'foo' },
          issues: [
            {
              ...baseInfo,
              kind: 'schema',
              type: 'boolean',
              input: 'foo',
              expected: 'boolean',
              received: '"foo"',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: { key1: 'foo', key2: 123, key3: 'foo' },
                  key: 'key1',
                  value: 'foo',
                },
              ],
            } satisfies BooleanIssue,
          ],
        } satisfies FailureDataset<InferIssue<typeof schema>>);
      });
    });
  });
});

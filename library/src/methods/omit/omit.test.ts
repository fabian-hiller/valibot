import { describe, expect, test } from 'vitest';
import {
  boolean,
  type BooleanIssue,
  number,
  type NumberIssue,
  object,
  objectWithRest,
  string,
} from '../../schemas/index.ts';
import type { InferIssue, UntypedDataset } from '../../types/index.ts';
import { expectNoSchemaIssue } from '../../vitest/index.ts';
import { omit } from './omit.ts';

describe('omit', () => {
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
    const schema = omit(object(entries), ['key1', 'key3']);

    test('should return schema object', () => {
      expect(schema).toStrictEqual({
        kind: 'schema',
        type: 'object',
        reference: object,
        expects: 'Object',
        entries: {
          key2: { ...number(), _run: expect.any(Function) },
          key4: { ...number(), _run: expect.any(Function) },
        },
        message: undefined,
        async: false,
        _run: expect.any(Function),
      } satisfies typeof schema);
    });

    describe('should return dataset without nested issues', () => {
      test('if not omitted keys are specified', () => {
        expectNoSchemaIssue(schema, [{ key2: 123, key4: 456 }]);
      });

      test('for unknown entries', () => {
        expect(
          schema._run(
            {
              typed: false,
              value: { key1: 'foo', key2: 123, key4: 456, other: null },
            },
            {}
          )
        ).toStrictEqual({
          typed: true,
          value: { key2: 123, key4: 456 },
        });
      });
    });

    describe('should return dataset with nested issues', () => {
      test('if a not omitted key is missing', () => {
        expect(
          schema._run({ typed: false, value: { key2: 123 } }, {})
        ).toStrictEqual({
          typed: false,
          value: { key2: 123 },
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
                  input: { key2: 123 },
                  key: 'key4',
                  value: undefined,
                },
              ],
            } satisfies NumberIssue,
          ],
        } satisfies UntypedDataset<InferIssue<typeof schema>>);
      });
    });
  });

  describe('objectWithRest', () => {
    const schema = omit(objectWithRest(entries, boolean()), ['key2', 'key3']);

    test('should return schema object', () => {
      expect(schema).toStrictEqual({
        kind: 'schema',
        type: 'object_with_rest',
        reference: objectWithRest,
        expects: 'Object',
        entries: {
          key1: { ...string(), _run: expect.any(Function) },
          key4: { ...number(), _run: expect.any(Function) },
        },
        rest: { ...boolean(), _run: expect.any(Function) },
        message: undefined,
        async: false,
        _run: expect.any(Function),
      } satisfies typeof schema);
    });

    describe('should return dataset without nested issues', () => {
      test('if not omitted keys are specified', () => {
        // @ts-expect-error
        expectNoSchemaIssue(schema, [{ key1: 'foo', key4: 456 }]);
      });

      test('if omitted key matches rest', () => {
        // @ts-expect-error
        expectNoSchemaIssue(schema, [{ key1: 'foo', key2: true, key4: 456 }]);
      });
    });

    describe('should return dataset with nested issues', () => {
      test('if a not omitted key is missing', () => {
        expect(
          schema._run({ typed: false, value: { key1: 'foo' } }, {})
        ).toStrictEqual({
          typed: false,
          value: { key1: 'foo' },
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
                  input: { key1: 'foo' },
                  key: 'key4',
                  value: undefined,
                },
              ],
            } satisfies NumberIssue,
          ],
        } satisfies UntypedDataset<InferIssue<typeof schema>>);
      });

      test('if an omitted key does not match rest', () => {
        expect(
          schema._run(
            { typed: false, value: { key1: 'foo', key2: null, key4: 456 } },
            {}
          )
        ).toStrictEqual({
          typed: false,
          value: { key1: 'foo', key2: null, key4: 456 },
          issues: [
            {
              ...baseInfo,
              kind: 'schema',
              type: 'boolean',
              input: null,
              expected: 'boolean',
              received: 'null',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input: { key1: 'foo', key2: null, key4: 456 },
                  key: 'key2',
                  value: null,
                },
              ],
            } satisfies BooleanIssue,
          ],
        } satisfies UntypedDataset<InferIssue<typeof schema>>);
      });
    });
  });
});

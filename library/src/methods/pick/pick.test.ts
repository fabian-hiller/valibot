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
import type { InferIssue, UntypedDataset } from '../../types/index.ts';
import { expectNoSchemaIssue } from '../../vitest/index.ts';
import { pick } from './pick.ts';

describe('pick', () => {
  const entries = { key1: string(), key2: number() };
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
    const schema = pick(object(entries), ['key1']);

    test('should return schema object', () => {
      expect(schema).toStrictEqual({
        kind: 'schema',
        type: 'object',
        expects: 'Object',
        entries: { key1: { ...string(), _run: expect.any(Function) } },
        message: undefined,
        async: false,
        _run: expect.any(Function),
      } satisfies typeof schema);
    });

    describe('should return no nested issues', () => {
      test('if key1 is specified', () => {
        expectNoSchemaIssue(schema, [{ key1: 'foo' }]);
      });

      test('for unknown entries', () => {
        expect(
          schema._run(
            { typed: false, value: { key1: 'foo', key2: 123, key3: false } },
            {}
          )
        ).toStrictEqual({
          typed: true,
          value: { key1: 'foo' },
        });
      });
    });

    describe('should return nested issues', () => {
      test('if key1 is missing', () => {
        expect(schema._run({ typed: false, value: {} }, {})).toStrictEqual({
          typed: false,
          value: {},
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
                  input: {},
                  key: 'key1',
                  value: undefined,
                },
              ],
            } satisfies StringIssue,
          ],
        } satisfies UntypedDataset<InferIssue<typeof schema>>);
      });
    });
  });

  describe('objectWithRest', () => {
    const schema = pick(objectWithRest(entries, boolean()), ['key2']);

    test('should return schema object', () => {
      expect(schema).toStrictEqual({
        kind: 'schema',
        type: 'object_with_rest',
        expects: 'Object',
        entries: { key2: { ...number(), _run: expect.any(Function) } },
        rest: { ...boolean(), _run: expect.any(Function) },
        message: undefined,
        async: false,
        _run: expect.any(Function),
      } satisfies typeof schema);
    });

    describe('should return no nested issues', () => {
      test('if key2 is specified', () => {
        // @ts-expect-error
        expectNoSchemaIssue(schema, [{ key2: 123 }]);
      });

      test('if key1 matches rest', () => {
        expect(
          schema._run({ typed: false, value: { key1: false, key2: 123 } }, {})
        ).toStrictEqual({
          typed: true,
          value: { key1: false, key2: 123 },
        });
      });
    });

    describe('should return nested issues', () => {
      test('if key2 is missing', () => {
        expect(schema._run({ typed: false, value: {} }, {})).toStrictEqual({
          typed: false,
          value: {},
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
                  input: {},
                  key: 'key2',
                  value: undefined,
                },
              ],
            } satisfies NumberIssue,
          ],
        } satisfies UntypedDataset<InferIssue<typeof schema>>);
      });

      test('if key1 does not match rest', () => {
        expect(
          schema._run({ typed: false, value: { key1: 'foo', key2: 123 } }, {})
        ).toStrictEqual({
          typed: false,
          value: { key1: 'foo', key2: 123 },
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
                  input: { key1: 'foo', key2: 123 },
                  key: 'key1',
                  value: 'foo',
                },
              ],
            } satisfies BooleanIssue,
          ],
        } satisfies UntypedDataset<InferIssue<typeof schema>>);
      });
    });
  });
});

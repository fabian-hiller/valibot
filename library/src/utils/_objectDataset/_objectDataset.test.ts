import { describe, expect, test } from 'vitest';
import {
  boolean,
  type BooleanIssue,
  number,
  type NumberIssue,
  object,
  type ObjectIssue,
  objectWithRest,
  type ObjectWithRestIssue,
  string,
  type StringIssue,
} from '../../schemas/index.ts';
import type { TypedDataset, UntypedDataset } from '../../types/index.ts';
import { _addObjectRestIssues } from '../_addObjectRestIssues/_addObjectRestIssues.ts';
import { _objectDataset } from './_objectDataset.ts';

describe('_objectDataset', () => {
  const baseInfo = {
    requirement: undefined,
    path: undefined,
    issues: undefined,
    lang: undefined,
    abortEarly: undefined,
    abortPipeEarly: undefined,
    skipPipe: undefined,
  };

  describe('object', () => {
    test('should return typed dataset', () => {
      const input = { key: 'foo' };
      expect(
        _objectDataset(
          // @ts-expect-error
          object({ key: string() }),
          object,
          { typed: false, value: input },
          {}
        )
      ).toStrictEqual({
        typed: true,
        value: input,
      } satisfies TypedDataset<{ key: string }, never>);
    });

    describe('should return untyped dataset', () => {
      test('with object issue', () => {
        expect(
          _objectDataset(
            // @ts-expect-error
            object({ key: string() }),
            object,
            { typed: false, value: null },
            {}
          )
        ).toStrictEqual({
          typed: false,
          value: null,
          issues: [
            {
              ...baseInfo,
              kind: 'schema',
              type: 'object',
              input: null,
              expected: 'Object',
              received: 'null',
              message: 'Invalid type: Expected Object but received null',
            },
          ],
        } satisfies UntypedDataset<ObjectIssue>);
      });

      test('with nested issues', () => {
        const input = { key1: null, key2: 123 };
        expect(
          _objectDataset(
            // @ts-expect-error
            object({ key1: string(), key2: number(), key3: boolean() }),
            object,
            { typed: false, value: input },
            {}
          )
        ).toStrictEqual({
          typed: false,
          value: input,
          issues: [
            {
              ...baseInfo,
              kind: 'schema',
              type: 'string',
              input: null,
              expected: 'string',
              received: 'null',
              message: 'Invalid type: Expected string but received null',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input,
                  key: 'key1',
                  value: input.key1,
                },
              ],
            },
            {
              ...baseInfo,
              kind: 'schema',
              type: 'boolean',
              input: undefined,
              expected: 'boolean',
              received: 'undefined',
              message: 'Invalid type: Expected boolean but received undefined',
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
        } satisfies UntypedDataset<StringIssue | BooleanIssue>);
      });

      test('with abort early', () => {
        const input = { key1: null, key2: 123 };
        expect(
          _objectDataset(
            // @ts-expect-error
            object({ key1: string(), key2: number(), key3: boolean() }),
            object,
            { typed: false, value: input },
            { abortEarly: true }
          )
        ).toStrictEqual({
          typed: false,
          value: {},
          issues: [
            {
              ...baseInfo,
              kind: 'schema',
              type: 'string',
              input: null,
              expected: 'string',
              received: 'null',
              message: 'Invalid type: Expected string but received null',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input,
                  key: 'key1',
                  value: input.key1,
                },
              ],
              abortEarly: true,
            },
          ],
        } satisfies UntypedDataset<StringIssue>);
      });
    });
  });

  describe('objectWithRest', () => {
    test('should return typed dataset', () => {
      const input = { key: 'foo', other: 123 };
      expect(
        _objectDataset(
          objectWithRest({ key: string() }, number()),
          objectWithRest,
          { typed: false, value: input },
          {},
          _addObjectRestIssues
        )
      ).toStrictEqual({
        typed: true,
        value: input,
      } satisfies TypedDataset<{ key: string; other: number }, never>);
    });

    describe('should return untyped dataset', () => {
      test('with object issue', () => {
        expect(
          _objectDataset(
            objectWithRest({ key: string() }, number()),
            objectWithRest,
            { typed: false, value: null },
            {},
            _addObjectRestIssues
          )
        ).toStrictEqual({
          typed: false,
          value: null,
          issues: [
            {
              ...baseInfo,
              kind: 'schema',
              type: 'object_with_rest',
              input: null,
              expected: 'Object',
              received: 'null',
              message: 'Invalid type: Expected Object but received null',
            },
          ],
        } satisfies UntypedDataset<ObjectWithRestIssue>);
      });

      test('with nested issues', () => {
        const input = {
          key1: 'foo',
          key2: '123',
          key3: true,
          key4: null,
          key5: 'bar',
        };
        expect(
          _objectDataset(
            objectWithRest({ key1: string(), key2: number() }, boolean()),
            objectWithRest,
            { typed: false, value: input },
            {},
            _addObjectRestIssues
          )
        ).toStrictEqual({
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
              message: 'Invalid type: Expected number but received "123"',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input,
                  key: 'key2',
                  value: input.key2,
                },
              ],
            },
            {
              ...baseInfo,
              kind: 'schema',
              type: 'boolean',
              input: null,
              expected: 'boolean',
              received: 'null',
              message: 'Invalid type: Expected boolean but received null',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input,
                  key: 'key4',
                  value: input.key4,
                },
              ],
            },
            {
              ...baseInfo,
              kind: 'schema',
              type: 'boolean',
              input: 'bar',
              expected: 'boolean',
              received: '"bar"',
              message: 'Invalid type: Expected boolean but received "bar"',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input,
                  key: 'key5',
                  value: input.key5,
                },
              ],
            },
          ],
        } satisfies UntypedDataset<NumberIssue | BooleanIssue>);
      });

      test('with abort early', () => {
        const input = {
          key1: 'foo',
          key2: '123',
          key3: true,
          key4: null,
          key5: 'bar',
        };
        expect(
          _objectDataset(
            objectWithRest({ key1: string(), key2: number() }, boolean()),
            objectWithRest,
            { typed: false, value: input },
            { abortEarly: true },
            _addObjectRestIssues
          )
        ).toStrictEqual({
          typed: false,
          value: { key1: 'foo' },
          issues: [
            {
              ...baseInfo,
              kind: 'schema',
              type: 'number',
              input: '123',
              expected: 'number',
              received: '"123"',
              message: 'Invalid type: Expected number but received "123"',
              path: [
                {
                  type: 'object',
                  origin: 'value',
                  input,
                  key: 'key2',
                  value: input.key2,
                },
              ],
              abortEarly: true,
            },
          ],
        } satisfies UntypedDataset<NumberIssue>);
      });
    });
  });
});

import { describe, expect, test } from 'vitest';
import type {
  NumberIssue,
  ObjectIssue,
  StringIssue,
} from '../../../../schemas/index.ts';
import type { TypedDataset, UntypedDataset } from '../../../../types/index.ts';
import { _isPartiallyTyped } from './_isPartiallyTyped.ts';

describe('_isPartiallyTyped', () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  type Input = {
    nested: { key: string };
    tuple: [number, { key: string }, number];
    other: string;
  };
  const pathList = [
    ['nested', 'key'],
    ['tuple', 1, 'key'],
  ] as const;

  const baseInfo = {
    message: 'message',
    requirement: undefined,
    path: undefined,
    issues: undefined,
    lang: undefined,
    abortEarly: undefined,
    abortPipeEarly: undefined,
  };

  describe('should return false', () => {
    test('if issue has no path', () => {
      const dataset: UntypedDataset<ObjectIssue> = {
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
            path: undefined,
          },
        ],
      };
      expect(_isPartiallyTyped(dataset, pathList)).toBe(false);
    });

    test('if part of path matches path of issue', () => {
      const input = {
        nested: null,
        tuple: [123, { key: 'foo' }, 456],
        other: 'bar',
      };
      const dataset: UntypedDataset<ObjectIssue> = {
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'object',
            input: null,
            expected: 'Object',
            received: 'null',
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'nested',
                value: input.nested,
              },
            ],
          },
        ],
      };
      expect(_isPartiallyTyped(dataset, pathList)).toBe(false);
    });

    test('if entire path matches path of issue', () => {
      const input = {
        nested: { key: null },
        tuple: [123, { key: 'foo' }, 456],
        other: 'bar',
      };
      const dataset: UntypedDataset<StringIssue> = {
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
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'nested',
                value: input.nested,
              },
              {
                type: 'object',
                origin: 'value',
                input: input.nested,
                key: 'key',
                value: input.nested.key,
              },
            ],
          },
        ],
      };
      expect(_isPartiallyTyped(dataset, pathList)).toBe(false);
    });
  });

  describe('should return true', () => {
    test('if there are no issues', () => {
      const input: Input = {
        nested: { key: 'foo' },
        tuple: [123, { key: 'baz' }, 456],
        other: 'bar',
      };
      const dataset: TypedDataset<Input, never> = {
        typed: true,
        value: input,
        issues: undefined,
      };
      expect(_isPartiallyTyped(dataset, pathList)).toBe(true);
    });

    test('if only unselected paths are untyped', () => {
      const input = {
        nested: { key: 'foo' },
        tuple: [123, { key: 'baz' }, null],
        other: null,
      };
      const dataset: UntypedDataset<NumberIssue | StringIssue> = {
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'number',
            input: null,
            expected: 'number',
            received: 'null',
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'tuple',
                value: input.tuple,
              },
              {
                type: 'array',
                origin: 'value',
                input: input.tuple,
                key: 2,
                value: input.tuple[2],
              },
            ],
          },
          {
            ...baseInfo,
            kind: 'schema',
            type: 'string',
            input: null,
            expected: 'string',
            received: 'null',
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'other',
                value: input.other,
              },
            ],
          },
        ],
      };
      expect(_isPartiallyTyped(dataset, pathList)).toBe(true);
    });
  });
});

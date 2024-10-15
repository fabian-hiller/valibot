import { describe, expect, test } from 'vitest';
import type {
  CheckIssue,
  IncludesIssue,
  MinLengthIssue,
  MinValueIssue,
} from '../../actions';
import type { NumberIssue, StringIssue } from '../../schemas';
import type { ArrayPathItem, ObjectPathItem, SetPathItem } from '../../types';
import { flatten } from './flatten.ts';

describe('flatten', () => {
  describe('should return the correct value of flat errors object', () => {
    const commonIssueInfo = {
      abortEarly: undefined,
      abortPipeEarly: undefined,
      issues: undefined,
      lang: undefined,
    };

    test('for a root issue', () => {
      const rootIssue: StringIssue = {
        ...commonIssueInfo,
        path: undefined,
        expected: 'string',
        input: 123,
        kind: 'schema',
        message: 'Invalid type: Expected string but received 123',
        received: '123',
        type: 'string',
      };

      expect(flatten([rootIssue])).toStrictEqual({
        root: ['Invalid type: Expected string but received 123'],
      });
    });

    test('for root issues', () => {
      const rootIssues: [
        IncludesIssue<string, 'foo'>,
        MinLengthIssue<string, 5>,
      ] = [
        {
          ...commonIssueInfo,
          path: undefined,
          expected: '"foo"',
          input: '123',
          kind: 'validation',
          message: 'Invalid content: Expected "foo" but received !"foo"',
          received: '!"foo"',
          requirement: 'foo',
          type: 'includes',
        },
        {
          ...commonIssueInfo,
          path: undefined,
          expected: '>=5',
          input: '123',
          kind: 'validation',
          message: 'Invalid length: Expected >=5 but received 3',
          received: '3',
          requirement: 5,
          type: 'min_length',
        },
      ];

      expect(flatten(rootIssues)).toStrictEqual({
        root: [
          'Invalid content: Expected "foo" but received !"foo"',
          'Invalid length: Expected >=5 but received 3',
        ],
      });
    });

    test('for a nested issue', () => {
      const nestedIssue: NumberIssue = {
        ...commonIssueInfo,
        expected: 'number',
        input: '1',
        kind: 'schema',
        message: 'Invalid type: Expected number but received "1"',
        path: [
          {
            type: 'array',
            origin: 'value',
            input: ['1'],
            key: 0,
            value: '1',
          } satisfies ArrayPathItem,
        ],
        received: '"1"',
        type: 'number',
      };

      expect(flatten([nestedIssue])).toStrictEqual({
        nested: {
          0: ['Invalid type: Expected number but received "1"'],
        },
      });
    });

    test('for nested issues', () => {
      const input = {
        k1: 12,
        k2: '21',
      };

      const nestedIssues: [StringIssue, NumberIssue] = [
        {
          ...commonIssueInfo,
          expected: 'string',
          input: 12,
          kind: 'schema',
          message: 'Invalid type: Expected string but received 12',
          path: [
            {
              type: 'object',
              origin: 'value',
              input,
              key: 'k1',
              value: 12,
            } satisfies ObjectPathItem,
          ],
          received: '12',
          type: 'string',
        },
        {
          expected: 'number',
          input: '21',
          kind: 'schema',
          message: 'Invalid type: Expected number but received "21"',
          path: [
            {
              type: 'object',
              origin: 'value',
              input,
              key: 'k2',
              value: '21',
            } satisfies ObjectPathItem,
          ],
          received: '"21"',
          type: 'number',
        },
      ];

      expect(flatten(nestedIssues)).toStrictEqual({
        nested: {
          k1: ['Invalid type: Expected string but received 12'],
          k2: ['Invalid type: Expected number but received "21"'],
        },
      });
    });

    test('for an issue that is not a root or nested issue', () => {
      const otherIssue: NumberIssue = {
        ...commonIssueInfo,
        expected: 'number',
        input: 'abc',
        kind: 'schema',
        message: 'Invalid type: Expected number but received "abc"',
        path: [
          {
            type: 'set',
            origin: 'value',
            input: new Set(['abc']),
            key: null,
            value: 'abc',
          } satisfies SetPathItem,
        ],
        received: '"abc"',
        type: 'number',
      };

      expect(flatten([otherIssue])).toStrictEqual({
        other: ['Invalid type: Expected number but received "abc"'],
      });
    });

    test('for issues that are not root or nested issues', () => {
      const input = new Set(['abc']);

      const otherIssues: [
        IncludesIssue<string, 'bar'>,
        MinLengthIssue<string, 4>,
      ] = [
        {
          ...commonIssueInfo,
          expected: '"bar"',
          input: 'abc',
          kind: 'validation',
          message: 'Invalid content: Expected "bar" but received !"bar"',
          path: [
            {
              type: 'set',
              origin: 'value',
              input,
              key: null,
              value: 'abc',
            } satisfies SetPathItem,
          ],
          received: '!"bar"',
          requirement: 'bar',
          type: 'includes',
        },
        {
          ...commonIssueInfo,
          expected: '>=4',
          input: 'abc',
          kind: 'validation',
          message: 'Invalid length: Expected >=4 but received 3',
          path: [
            {
              type: 'set',
              origin: 'value',
              input,
              key: null,
              value: 'abc',
            } satisfies SetPathItem,
          ],
          received: '3',
          requirement: 4,
          type: 'min_length',
        },
      ];

      expect(flatten(otherIssues)).toStrictEqual({
        other: [
          'Invalid content: Expected "bar" but received !"bar"',
          'Invalid length: Expected >=4 but received 3',
        ],
      });
    });

    test('for all types of issues together', () => {
      const input = { positiveValue: -1, positiveNums: new Set([-1]) };

      const issues: [
        MinValueIssue<number, 0>,
        MinValueIssue<number, 0>,
        CheckIssue<typeof input>,
      ] = [
        {
          ...commonIssueInfo,
          expected: '>=0',
          input: -1,
          kind: 'validation',
          message: 'Invalid value: Expected >=0 but received -1',
          path: [
            {
              type: 'object',
              origin: 'value',
              input,
              key: 'positiveValue',
              value: -1,
            } satisfies ObjectPathItem,
          ],
          received: '-1',
          requirement: 0,
          type: 'min_value',
        },
        {
          ...commonIssueInfo,
          expected: '>=0',
          input: -1,
          kind: 'validation',
          message: 'Invalid value: Expected >=0 but received -1',
          path: [
            {
              type: 'object',
              origin: 'value',
              input,
              key: 'positiveNums',
              value: input['positiveNums'],
            },
            {
              type: 'set',
              origin: 'value',
              input: input['positiveNums'],
              key: null,
              value: -1,
            },
          ] satisfies [ObjectPathItem, SetPathItem],
          received: '-1',
          requirement: 0,
          type: 'min_value',
        },
        {
          ...commonIssueInfo,
          expected: null,
          input,
          kind: 'validation',
          message: 'custom check error message',
          received: 'Object',
          requirement: () => false,
          type: 'check',
        },
      ];

      expect(flatten(issues)).toStrictEqual({
        root: ['custom check error message'],
        nested: {
          positiveValue: ['Invalid value: Expected >=0 but received -1'],
        },
        other: ['Invalid value: Expected >=0 but received -1'],
      });
    });
  });
});

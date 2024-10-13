import { describe, expect, test } from 'vitest';
import type { StringIssue } from '../../schemas/index.ts';
import type { PartialDataset } from '../../types/dataset.ts';
import { expectNoActionIssue } from '../../vitest/index.ts';
import {
  uniqueItems,
  type UniqueItemsAction,
  type UniqueItemsIssue,
} from './uniqueItems.ts';

describe('uniqueItems', () => {
  describe('should return action object', () => {
    const baseAction: Omit<UniqueItemsAction<unknown[], never>, 'message'> = {
      kind: 'validation',
      type: 'unique_items',
      reference: uniqueItems,
      expects: null,
      async: false,
      '~validate': expect.any(Function),
    };

    test('with undefined message', () => {
      const action: UniqueItemsAction<unknown[], undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(uniqueItems()).toStrictEqual(action);
      expect(uniqueItems<unknown[], undefined>(undefined)).toStrictEqual(
        action
      );
    });

    test('with string message', () => {
      const message = 'message';
      expect(uniqueItems<unknown[], 'message'>(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies UniqueItemsAction<unknown[], 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(uniqueItems<unknown[], typeof message>(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies UniqueItemsAction<unknown[], typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = uniqueItems<unknown[]>();

    test('for untyped inputs', () => {
      const issues: [StringIssue] = [
        {
          kind: 'schema',
          type: 'string',
          input: null,
          expected: 'string',
          received: 'null',
          message: 'message',
        },
      ];
      expect(
        action['~validate']({ typed: false, value: null, issues }, {})
      ).toStrictEqual({
        typed: false,
        value: null,
        issues,
      });
    });

    test('for empty array', () => {
      expectNoActionIssue(action, [[]]);
    });

    test('for valid content', () => {
      expectNoActionIssue(action, [[10, 11, 12, 13, 99]]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = uniqueItems<number[], 'message'>('message');

    const baseIssue: Omit<UniqueItemsIssue<number[]>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'unique_items',
      expected: null,
      message: 'message',
      requirement: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for invalid(duplicated) content', () => {
      const input = [5, 30, 2, 30, 8, 30];
      expect(
        action['~validate']({ typed: true, value: input }, {})
      ).toStrictEqual({
        typed: true,
        value: input,
        issues: [
          {
            ...baseIssue,
            input: input[3],
            received: `${input[3]}`,
            path: [
              {
                type: 'array',
                origin: 'value',
                input,
                key: 3,
                value: input[3],
              },
            ],
          },
          {
            ...baseIssue,
            input: input[5],
            received: `${input[5]}`,
            path: [
              {
                type: 'array',
                origin: 'value',
                input,
                key: 5,
                value: input[5],
              },
            ],
          },
        ],
      } satisfies PartialDataset<number[], UniqueItemsIssue<number[]>>);
    });
  });
});

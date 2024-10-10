import { describe, expect, test } from 'vitest';
import type { StringIssue } from '../../schemas/index.ts';
import {
  expectActionIssueAsync,
  expectNoActionIssueAsync,
} from '../../vitest/index.ts';
import { type RawCheckActionAsync, rawCheckAsync } from './rawCheckAsync.ts';
import type { RawCheckIssue } from './types.ts';

describe('rawCheckAsync', () => {
  const action = rawCheckAsync<number>(async ({ dataset, addIssue }) => {
    if (dataset.typed && dataset.value <= 0) {
      addIssue({ message: 'message' });
    }
  });

  test('should return action object', () => {
    expect(action).toStrictEqual({
      kind: 'validation',
      type: 'raw_check',
      reference: rawCheckAsync,
      expects: null,
      async: true,
      '~validate': expect.any(Function),
    } satisfies RawCheckActionAsync<number>);
  });

  describe('should return dataset without issues', () => {
    test('for untyped inputs', async () => {
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
        await action['~validate']({ typed: false, value: null, issues }, {})
      ).toStrictEqual({
        typed: false,
        value: null,
        issues,
      });
    });

    test('for valid inputs', async () => {
      await expectNoActionIssueAsync(action, [1, 12345, Infinity]);
    });
  });

  describe('should return dataset with issues', () => {
    const baseIssue: Omit<RawCheckIssue<number>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'raw_check',
      expected: null,
      message: 'message',
    };

    test('for invalid inputs', async () => {
      await expectActionIssueAsync(action, baseIssue, [
        0,
        -1,
        -12345,
        -Infinity,
      ]);
    });
  });
});

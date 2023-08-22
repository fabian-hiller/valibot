import { describe, expect, test } from 'vitest';
import type { Issue } from '../../types.ts';
import { getIssues } from './getIssues.ts';

describe('getIssues', () => {
  test('should return issue object', () => {
    const info1 = {
      reason: 'any' as const,
      validation: 'validation',
      origin: 'value',
      message: 'message',
      input: 'input',
    };
    const issue1 = getIssues(
      {},
      info1.reason,
      info1.validation,
      info1.message,
      info1.input
    );
    expect(issue1).toEqual({
      issues: [info1],
    });

    const info2: Issue = {
      reason: 'object',
      validation: 'validation',
      origin: 'key',
      message: 'message',
      input: 'input',
      issues: [
        {
          reason: 'any',
          validation: 'validation',
          origin: 'value',
          message: 'message',
          input: 'input',
        },
      ],
      abortEarly: true,
      abortPipeEarly: false,
    };
    const issue2 = getIssues(
      {
        origin: info2.origin,
        abortEarly: info2.abortEarly,
        abortPipeEarly: info2.abortPipeEarly,
      },
      info2.reason,
      info2.validation,
      info2.message,
      info2.input,
      info2.issues
    );
    expect(issue2).toEqual({ issues: [info2] });
  });
});

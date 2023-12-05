import { describe, expect, test } from 'vitest';
import { actionIssue } from './actionIssue.ts';

describe('actionIssue', () => {
  test('should return results with issues', () => {
    expect(actionIssue('test', 'error', 123)).toEqual({
      issues: [
        {
          validation: 'test',
          message: 'error',
          input: 123,
        },
      ],
    });
  });
});

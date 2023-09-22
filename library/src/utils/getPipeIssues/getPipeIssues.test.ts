import { describe, expect, test } from 'vitest';
import { getPipeIssues } from './getPipeIssues.ts';

describe('getPipeIssues', () => {
  test('should return results with issues', () => {
    expect(getPipeIssues('test', 'error', 123)).toEqual({
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

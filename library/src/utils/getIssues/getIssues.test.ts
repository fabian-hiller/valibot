import { describe, expect, test } from 'vitest';
import type { Issues } from '../../types.ts';
import { getIssues } from './getIssues.ts';

describe('getIssues', () => {
  test('should return output results', () => {
    const value1: Issues = [
      {
        reason: 'type',
        validation: 'any',
        origin: 'value',
        message: 'error',
        input: 123,
      },
    ];
    expect(getIssues(value1)).toEqual({ issues: value1 });
  });
});

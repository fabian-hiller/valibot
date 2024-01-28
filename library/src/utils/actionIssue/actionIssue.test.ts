import { describe, expect, test } from 'vitest';
import type { PipeActionContext } from '../../types/index.ts';
import { actionIssue } from './actionIssue.ts';

describe('actionIssue', () => {
  test('should return results with issues', () => {
    const context: PipeActionContext = {
      type: 'min_length',
      expects: '>=10',
      message: undefined,
      requirement: 10,
    };
    const input = 'hello';
    const label = 'length';
    const received = '5';
    expect(actionIssue(context, input, label, received)).toEqual({
      issues: [{ context, input, label, received }],
    });
  });
});

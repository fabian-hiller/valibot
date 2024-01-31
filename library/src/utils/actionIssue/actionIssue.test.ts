import { describe, expect, test } from 'vitest';
import type { PipeActionContext } from '../../types/index.ts';
import { minLength } from '../../validations/index.ts';
import { actionIssue } from './actionIssue.ts';

describe('actionIssue', () => {
  test('should return results with issues', () => {
    const context: PipeActionContext = {
      type: 'min_length',
      expects: '>=10',
      message: undefined,
      requirement: 10,
    };
    const reference = minLength;
    const input = 'hello';
    const label = 'length';
    const received = '5';
    expect(actionIssue(context, reference, input, label, received)).toEqual({
      issues: [{ context, reference, input, label, received }],
    });
  });
});

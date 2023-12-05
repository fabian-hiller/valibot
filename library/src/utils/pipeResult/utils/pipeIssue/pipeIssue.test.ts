import { describe, expect, test } from 'vitest';
import { pipeInfo } from '../pipeInfo/index.ts';
import { pipeIssue } from './pipeIssue.ts';

describe('pipeIssue', () => {
  test('should return issue object', () => {
    const pipeInfo1 = pipeInfo({}, 'any');
    const valiInfo1 = {
      validation: 'validation',
      message: 'message',
      input: 'input',
    };
    const issue1 = pipeIssue(pipeInfo1, valiInfo1);
    expect(issue1).toEqual({
      ...pipeInfo1,
      ...valiInfo1,
      origin: pipeInfo1?.origin || 'value',
    });

    const pipeInfo2 = pipeInfo({ abortEarly: true, origin: 'key' }, 'object');
    const valiInfo2 = {
      validation: 'validation',
      message: 'message',
      input: 'input',
      path: [],
    };
    const issue2 = pipeIssue(pipeInfo2, valiInfo2);
    expect(issue2).toEqual({
      ...pipeInfo2,
      ...valiInfo2,
      origin: pipeInfo2?.origin || 'value',
    });
  });
});

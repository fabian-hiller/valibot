import { describe, expect, test } from 'vitest';
import { getPipeInfo } from '../getPipeInfo/index.ts';
import { getIssue } from './getIssue.ts';

describe('getIssue', () => {
  test('should return issue object', () => {
    const pipeInfo1 = getPipeInfo({}, 'any');
    const valiInfo1 = {
      validation: 'validation',
      message: 'message',
      input: 'input',
    };
    const issue1 = getIssue(pipeInfo1, valiInfo1);
    expect(issue1).toEqual({
      ...pipeInfo1,
      ...valiInfo1,
      origin: pipeInfo1?.origin || 'value',
    });

    const pipeInfo2 = getPipeInfo(
      { abortEarly: true, origin: 'key' },
      'object'
    );
    const valiInfo2 = {
      validation: 'validation',
      message: 'message',
      input: 'input',
    };
    const issue2 = getIssue(pipeInfo2, valiInfo2);
    expect(issue2).toEqual({
      ...pipeInfo2,
      ...valiInfo2,
      origin: pipeInfo2?.origin || 'value',
    });
  });
});

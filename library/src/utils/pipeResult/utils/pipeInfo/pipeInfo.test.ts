import { describe, expect, test } from 'vitest';
import type { ParseInfo } from '../../../../types/index.ts';
import { pipeInfo } from './pipeInfo.ts';

describe('pipeInfo', () => {
  test('should return pipe info', () => {
    const parseInfo1: ParseInfo = {};
    const reason1 = 'any';
    const pipeInfo1 = pipeInfo(parseInfo1, reason1);
    expect(pipeInfo1).toEqual({ ...parseInfo1, reason: reason1 });

    const parseInfo2: ParseInfo = { abortEarly: true, origin: 'key' };
    const reason2 = 'number';
    const pipeInfo2 = pipeInfo(parseInfo2, reason2);
    expect(pipeInfo2).toEqual({ ...parseInfo2, reason: reason2 });
  });
});

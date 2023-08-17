import { describe, expect, test } from 'vitest';
import { getPipeInfo } from './getPipeInfo.ts';

describe('getPipeInfo', () => {
  test('should return pipe info', () => {
    expect(getPipeInfo(undefined, 'number')).toEqual({ reason: 'number' });
    expect(getPipeInfo({ abortEarly: true }, 'string')).toEqual({
      abortEarly: true,
      reason: 'string',
    });
  });
});

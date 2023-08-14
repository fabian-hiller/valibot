import { describe, expect, test } from 'vitest';
import { getPipeInfo } from './getPipeInfo.ts';

describe('getPipeInfo', () => {
  test('should return pipe info', () => {
    expect(getPipeInfo(undefined, 'number')).toEqual({ reason: 'number' });
    expect(getPipeInfo({ origin: 'value' }, 'string')).toEqual({
      origin: 'value',
      reason: 'string',
    });
  });
});

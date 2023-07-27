import { describe, expect, test } from 'vitest';
import { getErrorAndPipe } from './getErrorAndPipe.ts';

describe('getErrorAndPipe', () => {
  test('should return error and pipe', () => {
    expect(getErrorAndPipe(undefined, undefined)).toEqual({
      error: undefined,
      pipe: [],
    });
    expect(getErrorAndPipe('Error', undefined)).toEqual({
      error: 'Error',
      pipe: [],
    });
    expect(getErrorAndPipe(undefined, [])).toEqual({
      error: undefined,
      pipe: [],
    });
    expect(getErrorAndPipe('Error', [])).toEqual({
      error: 'Error',
      pipe: [],
    });
    expect(getErrorAndPipe(undefined, [() => 1, () => 2]).pipe.length).toBe(2);
    expect(getErrorAndPipe('Error', [() => 1, () => 2]).pipe.length).toBe(2);
  });
});

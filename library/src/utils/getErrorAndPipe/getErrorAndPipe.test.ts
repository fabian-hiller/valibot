import { describe, expect, test } from 'vitest';
import { getErrorAndPipe } from './getErrorAndPipe.ts';
import { toCustom } from '../../transformations/index.ts';

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
    expect(
      getErrorAndPipe(undefined, [toCustom(() => 1), toCustom(() => 2)]).pipe
        .length
    ).toBe(2);
    expect(
      getErrorAndPipe('Error', [toCustom(() => 1), toCustom(() => 2)]).pipe
        .length
    ).toBe(2);
  });
});

import { describe, expect, test } from 'vitest';
import { comparable } from '../../comparable.ts';
import { string } from '../../schemas/index.ts';
import { getRestAndDefaultArgs } from './getRestAndDefaultArgs.ts';

describe('getRestAndDefaultArgs', () => {
  test('should return tuple args', () => {
    expect(getRestAndDefaultArgs(undefined, undefined, undefined)).toEqual([
      undefined,
      undefined,
      undefined,
    ]);
    expect(getRestAndDefaultArgs(string(), undefined, undefined)).toEqual([
      comparable(string()),
      undefined,
      undefined,
    ]);
    expect(getRestAndDefaultArgs(string(), [], undefined)).toEqual([
      comparable(string()),
      undefined,
      [],
    ]);
    expect(getRestAndDefaultArgs(string(), 'error', undefined)).toEqual([
      comparable(string()),
      'error',
      undefined,
    ]);
    expect(getRestAndDefaultArgs(string(), 'error', [])).toEqual([
      comparable(string()),
      'error',
      [],
    ]);
    expect(getRestAndDefaultArgs([], undefined, undefined)).toEqual([
      undefined,
      undefined,
      [],
    ]);
    expect(getRestAndDefaultArgs('error', undefined, undefined)).toEqual([
      undefined,
      'error',
      undefined,
    ]);
    expect(getRestAndDefaultArgs('error', [], undefined)).toEqual([
      undefined,
      'error',
      [],
    ]);
    expect(getRestAndDefaultArgs(undefined, 'error', undefined)).toEqual([
      undefined,
      'error',
      undefined,
    ]);
    expect(getRestAndDefaultArgs(undefined, 'error', [])).toEqual([
      undefined,
      'error',
      [],
    ]);
  });
});

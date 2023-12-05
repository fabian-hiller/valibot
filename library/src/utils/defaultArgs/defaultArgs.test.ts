import { describe, expect, test } from 'vitest';
import { defaultArgs } from './defaultArgs.ts';

describe('defaultArgs', () => {
  test('should return error and pipe', () => {
    expect(defaultArgs(undefined, undefined)).toEqual([undefined, undefined]);
    expect(defaultArgs('error', undefined)).toEqual(['error', undefined]);
    expect(defaultArgs([], undefined)).toEqual([undefined, []]);
    expect(defaultArgs('error', undefined)).toEqual(['error', undefined]);
    expect(defaultArgs('error', [])).toEqual(['error', []]);
  });
});

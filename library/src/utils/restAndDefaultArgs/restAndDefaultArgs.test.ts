import { describe, expect, test } from 'vitest';
import { comparable } from '../../comparable.ts';
import { string } from '../../schemas/index.ts';
import { restAndDefaultArgs } from './restAndDefaultArgs.ts';

describe('restAndDefaultArgs', () => {
  test('should return tuple args', () => {
    expect(restAndDefaultArgs(undefined, undefined, undefined)).toEqual([
      undefined,
      undefined,
      undefined,
      undefined,
    ]);
    expect(restAndDefaultArgs(string(), undefined, undefined)).toEqual([
      comparable(string()),
      undefined,
      undefined,
      undefined,
    ]);
    expect(restAndDefaultArgs(string(), [], undefined)).toEqual([
      comparable(string()),
      undefined,
      [],
      undefined,
    ]);
    expect(restAndDefaultArgs(string(), 'error', undefined)).toEqual([
      comparable(string()),
      'error',
      undefined,
      undefined,
    ]);
    expect(restAndDefaultArgs(string(), 'error', [])).toEqual([
      comparable(string()),
      'error',
      [],
      undefined,
    ]);
    expect(restAndDefaultArgs([], undefined, undefined)).toEqual([
      undefined,
      undefined,
      [],
      undefined,
    ]);
    expect(restAndDefaultArgs('error', undefined, undefined)).toEqual([
      undefined,
      'error',
      undefined,
      undefined,
    ]);
    expect(restAndDefaultArgs('error', [], undefined)).toEqual([
      undefined,
      'error',
      [],
      undefined,
    ]);
    expect(restAndDefaultArgs(undefined, 'error', undefined)).toEqual([
      undefined,
      'error',
      undefined,
      undefined,
    ]);
    expect(restAndDefaultArgs(undefined, 'error', [])).toEqual([
      undefined,
      'error',
      [],
      undefined,
    ]);
  });
});

import { describe, expect, test } from 'vitest';
import { string } from '../../schemas/index.ts';
import { restAndDefaultArgs } from './restAndDefaultArgs.ts';

describe('restAndDefaultArgs', () => {
  test('should return tuple args', () => {
    expect(restAndDefaultArgs(undefined, undefined, undefined)).toEqual([
      undefined,
      undefined,
      undefined,
    ]);
    expect(
      JSON.stringify(restAndDefaultArgs(string(), undefined, undefined))
    ).toEqual(JSON.stringify([string(), undefined, undefined]));
    expect(JSON.stringify(restAndDefaultArgs(string(), [], undefined))).toEqual(
      JSON.stringify([string(), undefined, []])
    );
    expect(
      JSON.stringify(restAndDefaultArgs(string(), 'error', undefined))
    ).toEqual(JSON.stringify([string(), 'error', undefined]));
    expect(JSON.stringify(restAndDefaultArgs(string(), 'error', []))).toEqual(
      JSON.stringify([string(), 'error', []])
    );
    expect(restAndDefaultArgs([], undefined, undefined)).toEqual([
      undefined,
      undefined,
      [],
    ]);
    expect(restAndDefaultArgs('error', undefined, undefined)).toEqual([
      undefined,
      'error',
      undefined,
    ]);
    expect(restAndDefaultArgs('error', [], undefined)).toEqual([
      undefined,
      'error',
      [],
    ]);
    expect(restAndDefaultArgs(undefined, 'error', undefined)).toEqual([
      undefined,
      'error',
      undefined,
    ]);
    expect(restAndDefaultArgs(undefined, 'error', [])).toEqual([
      undefined,
      'error',
      [],
    ]);
  });
});

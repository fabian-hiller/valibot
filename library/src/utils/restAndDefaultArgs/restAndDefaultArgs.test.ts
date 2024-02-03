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
    expect(restAndDefaultArgs(string(), undefined, undefined)).toEqualSchema([
      string(),
      undefined,
      undefined,
    ]);
    expect(restAndDefaultArgs(string(), [], undefined)).toEqualSchema([
      string(),
      undefined,
      [],
    ]);
    expect(restAndDefaultArgs(string(), 'error', undefined)).toEqualSchema([
      string(),
      'error',
      undefined,
    ]);
    expect(restAndDefaultArgs(string(), 'error', [])).toEqualSchema([
      string(),
      'error',
      [],
    ]);
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

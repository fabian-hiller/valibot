import { describe, expect, test } from 'vitest';
import { comparable } from '../../../../comparable.ts';
import { string } from '../../../string/index.ts';
import { getTupleArgs } from './getTupleArgs.ts';

describe('getTupleArgs', () => {
  test('should return tuple args', () => {
    expect(getTupleArgs(undefined, undefined, undefined)).toEqual([
      undefined,
      undefined,
      undefined,
    ]);
    expect(getTupleArgs(string(), undefined, undefined)).toEqual([
      comparable(string()),
      undefined,
      undefined,
    ]);
    expect(getTupleArgs(string(), [], undefined)).toEqual([
      comparable(string()),
      undefined,
      [],
    ]);
    expect(getTupleArgs(string(), 'error', undefined)).toEqual([
      comparable(string()),
      'error',
      undefined,
    ]);
    expect(getTupleArgs(string(), 'error', [])).toEqual([
      comparable(string()),
      'error',
      [],
    ]);
    expect(getTupleArgs([], undefined, undefined)).toEqual([
      undefined,
      undefined,
      [],
    ]);
    expect(getTupleArgs('error', undefined, undefined)).toEqual([
      undefined,
      'error',
      undefined,
    ]);
    expect(getTupleArgs('error', [], undefined)).toEqual([
      undefined,
      'error',
      [],
    ]);
  });
});

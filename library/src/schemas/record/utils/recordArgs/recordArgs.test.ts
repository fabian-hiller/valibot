import { describe, expect, test } from 'vitest';
import { comparable } from '../../../../comparable.ts';
import { string } from '../../../string/index.ts';
import { recordArgs } from './recordArgs.ts';

describe('recordArgs', () => {
  test('should return tuple args', () => {
    expect(recordArgs(string(), undefined, undefined, undefined)).toEqual([
      comparable(string()),
      comparable(string()),
      undefined,
      undefined,
    ]);
    expect(recordArgs(string(), [], undefined, undefined)).toEqual([
      comparable(string()),
      comparable(string()),
      undefined,
      [],
    ]);
    expect(recordArgs(string(), 'error', undefined, undefined)).toEqual([
      comparable(string()),
      comparable(string()),
      'error',
      undefined,
    ]);
    expect(recordArgs(string(), 'error', [], undefined)).toEqual([
      comparable(string()),
      comparable(string()),
      'error',
      [],
    ]);
    expect(recordArgs(string(), string(), undefined, undefined)).toEqual([
      comparable(string()),
      comparable(string()),
      undefined,
      undefined,
    ]);
    expect(recordArgs(string(), string(), [], undefined)).toEqual([
      comparable(string()),
      comparable(string()),
      undefined,
      [],
    ]);
    expect(recordArgs(string(), string(), 'error', undefined)).toEqual([
      comparable(string()),
      comparable(string()),
      'error',
      undefined,
    ]);
    expect(recordArgs(string(), string(), 'error', [])).toEqual([
      comparable(string()),
      comparable(string()),
      'error',
      [],
    ]);
  });
});

import { describe, expect, test } from 'vitest';
import { comparable } from '../../../../comparable.ts';
import { string } from '../../../string/index.ts';
import { getRecordArgs } from './getRecordArgs.ts';

describe('getRecordArgs', () => {
  test('should return tuple args', () => {
    expect(getRecordArgs(string(), undefined, undefined, undefined)).toEqual([
      comparable(string()),
      comparable(string()),
      undefined,
      undefined,
    ]);
    expect(getRecordArgs(string(), [], undefined, undefined)).toEqual([
      comparable(string()),
      comparable(string()),
      undefined,
      [],
    ]);
    expect(getRecordArgs(string(), 'error', undefined, undefined)).toEqual([
      comparable(string()),
      comparable(string()),
      'error',
      undefined,
    ]);
    expect(getRecordArgs(string(), 'error', [], undefined)).toEqual([
      comparable(string()),
      comparable(string()),
      'error',
      [],
    ]);
    expect(getRecordArgs(string(), string(), undefined, undefined)).toEqual([
      comparable(string()),
      comparable(string()),
      undefined,
      undefined,
    ]);
    expect(getRecordArgs(string(), string(), [], undefined)).toEqual([
      comparable(string()),
      comparable(string()),
      undefined,
      [],
    ]);
    expect(getRecordArgs(string(), string(), 'error', undefined)).toEqual([
      comparable(string()),
      comparable(string()),
      'error',
      undefined,
    ]);
    expect(getRecordArgs(string(), string(), 'error', [])).toEqual([
      comparable(string()),
      comparable(string()),
      'error',
      [],
    ]);
  });
});

import { describe, expect, test } from 'vitest';
import { string } from '../../../string/index.ts';
import { recordArgs } from './recordArgs.ts';

describe('recordArgs', () => {
  test('should return tuple args', () => {
    expect(
      JSON.stringify(recordArgs(string(), undefined, undefined, undefined))
    ).toEqual(JSON.stringify([string(), string(), undefined, undefined]));
    expect(
      JSON.stringify(recordArgs(string(), [], undefined, undefined))
    ).toEqual(JSON.stringify([string(), string(), undefined, []]));
    expect(
      JSON.stringify(recordArgs(string(), 'error', undefined, undefined))
    ).toEqual(JSON.stringify([string(), string(), 'error', undefined]));
    expect(
      JSON.stringify(recordArgs(string(), 'error', [], undefined))
    ).toEqual(JSON.stringify([string(), string(), 'error', []]));
    expect(
      JSON.stringify(recordArgs(string(), string(), undefined, undefined))
    ).toEqual(JSON.stringify([string(), string(), undefined, undefined]));
    expect(
      JSON.stringify(recordArgs(string(), string(), [], undefined))
    ).toEqual(JSON.stringify([string(), string(), undefined, []]));
    expect(
      JSON.stringify(recordArgs(string(), string(), 'error', undefined))
    ).toEqual(JSON.stringify([string(), string(), 'error', undefined]));
    expect(JSON.stringify(recordArgs(string(), string(), 'error', []))).toEqual(
      JSON.stringify([string(), string(), 'error', []])
    );
  });
});

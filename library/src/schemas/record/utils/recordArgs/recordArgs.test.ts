import { describe, expect, test } from 'vitest';
import { string } from '../../../string/index.ts';
import { recordArgs } from './recordArgs.ts';

describe('recordArgs', () => {
  test('should return tuple args', () => {
    expect(recordArgs(string(), undefined, undefined, undefined)).toEqualSchema(
      [string(), string(), undefined, undefined]
    );
    expect(recordArgs(string(), [], undefined, undefined)).toEqualSchema([
      string(),
      string(),
      undefined,
      [],
    ]);
    expect(recordArgs(string(), 'error', undefined, undefined)).toEqualSchema([
      string(),
      string(),
      'error',
      undefined,
    ]);
    expect(recordArgs(string(), 'error', [], undefined)).toEqualSchema([
      string(),
      string(),
      'error',
      [],
    ]);
    expect(recordArgs(string(), string(), undefined, undefined)).toEqualSchema([
      string(),
      string(),
      undefined,
      undefined,
    ]);
    expect(recordArgs(string(), string(), [], undefined)).toEqualSchema([
      string(),
      string(),
      undefined,
      [],
    ]);
    expect(recordArgs(string(), string(), 'error', undefined)).toEqualSchema([
      string(),
      string(),
      'error',
      undefined,
    ]);
    expect(recordArgs(string(), string(), 'error', [])).toEqualSchema([
      string(),
      string(),
      'error',
      [],
    ]);
  });
});

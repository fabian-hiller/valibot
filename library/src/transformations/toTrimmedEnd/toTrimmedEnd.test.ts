import { describe, expect, test } from 'vitest';
import { toTrimmedEnd } from './toTrimmedEnd.ts';

describe('toTrimmedEnd', () => {
  test('should transform to trimmed end', () => {
    const transform = toTrimmedEnd();
    expect(transform(' test    ')).toEqual({ output: ' test' });
  });
});

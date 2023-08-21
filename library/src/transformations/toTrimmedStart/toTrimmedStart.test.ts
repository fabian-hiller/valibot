import { describe, expect, test } from 'vitest';
import { toTrimmedStart } from './toTrimmedStart.ts';

describe('toTrimmedStart', () => {
  test('should transform to trimmed start', () => {
    const transform = toTrimmedStart();
    expect(transform(' test    ').output).toBe('test    ');
  });
});

import { describe, expect, test } from 'vitest';
import { toTrimmedEnd } from './toTrimmedEnd';

describe('toTrimmedEnd', () => {
  test('should transform to trimmed end', () => {
    const transform = toTrimmedEnd();
    expect(transform(' test    ')).toBe(' test');
  });
});

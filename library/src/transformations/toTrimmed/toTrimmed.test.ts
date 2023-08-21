import { describe, expect, test } from 'vitest';
import { toTrimmed } from './toTrimmed.ts';

describe('toTrimmed', () => {
  test('should transform to trimmed', () => {
    const transform = toTrimmed();
    expect(transform(' test    ').output).toBe('test');
  });
});

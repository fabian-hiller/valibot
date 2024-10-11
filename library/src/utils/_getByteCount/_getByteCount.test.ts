import { describe, expect, test } from 'vitest';
import { _getByteCount } from './_getByteCount.ts';

describe('_getByteCount', () => {
  test('should return byte count', () => {
    expect(_getByteCount('hello world')).toBe(11);
    expect(_getByteCount('😀')).toBe(4);
    expect(_getByteCount('🧑🏻‍💻')).toBe(15);
    expect(_getByteCount('𝄞')).toBe(4);
    expect(_getByteCount('สวัสดี')).toBe(18);
  });
});

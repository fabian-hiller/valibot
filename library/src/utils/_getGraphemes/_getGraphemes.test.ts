import { describe, expect, test } from 'vitest';
import { _getGraphemes } from './_getGraphemes.ts';

describe('_getGraphemes', () => {
  test('should give correct grapheme count', () => {
    expect(_getGraphemes('hello world')).toBe(11);
    expect(_getGraphemes('😀')).toBe(1);
    expect(_getGraphemes('🧑🏻‍💻')).toBe(1);
    expect(_getGraphemes('𝄞')).toBe(1);
    expect(_getGraphemes('สวัสดี')).toBe(4);
  });
});

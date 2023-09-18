import { describe, expect, test } from 'vitest';
import { number, object, string } from '../../schemas/index.ts';
import { minLength } from '../../validations/index.ts';
import { is } from './is.ts';

describe('is', () => {
  test('should return true', () => {
    const output1 = is(string(), 'hello');
    expect(output1).toBe(true);
    const output2 = is(number(), 123);
    expect(output2).toBe(true);
    const output3 = is(object({ test: string() }), { test: 'hello' });
    expect(output3).toBe(true);
  });

  test('should return false', () => {
    expect(is(string(), 123)).toBe(false);
    expect(is(number(), 'hello')).toBe(false);
    expect(is(object({ test: string() }), {})).toBe(false);
  });

  test('should accept parsing options', () => {
    expect(is(string([minLength(1)]), '', { skipPipe: true })).toBe(true);
    expect(is(string([minLength(1)]), '', { skipPipe: false })).toBe(false);
  });
});

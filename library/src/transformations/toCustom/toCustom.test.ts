import { describe, expect, test } from 'vitest';
import { toCustom } from './toCustom.ts';

describe('toCustom', () => {
  test('should transform the custom', () => {
    const transform1 = toCustom<string>((input) => input.trim());
    expect(transform1._parse(' test ').output).toBe('test');
    const transform2 = toCustom<number>((input) => input + 1);
    expect(transform2._parse(1).output).toBe(2);
  });
});

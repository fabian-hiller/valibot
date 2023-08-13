import { describe, expect, test } from 'vitest';
import { toCustom } from './toCustom.ts';

describe('toCustom', () => {
  test('should transform the custom', () => {
    const transform1 = toCustom<string>((input) => input.trim());
    expect(transform1(' test ')).toEqual({ output: 'test' });
    const transform2 = toCustom<number>((input) => input + 1);
    expect(transform2(1)).toEqual({ output: 2 });
  });
});

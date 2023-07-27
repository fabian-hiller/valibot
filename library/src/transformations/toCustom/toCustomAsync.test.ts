import { describe, expect, test } from 'vitest';
import { toCustomAsync } from './toCustomAsync.ts';

describe('toCustomAsync', () => {
  test('should transform the custom', async () => {
    const transform1 = toCustomAsync<string>(async (input) => input.trim());
    expect(await transform1(' test ')).toBe('test');
    const transform2 = toCustomAsync<number>(async (input) => input + 1);
    expect(await transform2(1)).toBe(2);
  });
});

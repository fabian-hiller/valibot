import { describe, expect, test } from 'vitest';
import { executePipeAsync } from './executePipeAsync';
import type { PipeAsync } from '../types';

describe('executePipeAsync', () => {
  test('should execute the pipe', async () => {
    const pipe: PipeAsync<number> = [
      (input) => input + 1,
      async (input) => input * 2,
      (input) => input - 1,
    ];
    const info = { reason: 'any', origin: 'key' } as const;
    const output = await executePipeAsync<number>(1, pipe, info);
    expect(output).toBe(3);
  });
});

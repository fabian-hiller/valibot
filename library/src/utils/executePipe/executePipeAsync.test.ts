import { describe, expect, test } from 'vitest';
import { type ValiError } from '../../error/index.ts';
import { minValue } from '../../validations/index.ts';
import type { PipeAsync } from '../../types.ts';
import { executePipeAsync } from './executePipeAsync.ts';

describe('executePipeAsync', () => {
  const info = { reason: 'any', origin: 'key' } as const;

  test('should execute the pipe', async () => {
    const pipe: PipeAsync<number> = [
      (input) => input + 1,
      async (input) => input * 2,
      (input) => input - 1,
    ];
    const output = await executePipeAsync<number>(1, pipe, info);
    expect(output).toBe(3);
  });

  test('should throw every issue', async () => {
    const pipe: PipeAsync<number> = [minValue(5), minValue(10), minValue(15)];
    await expect(
      executePipeAsync<number>(0, pipe, info)
    ).rejects.toThrowError();
    try {
      await executePipeAsync<number>(0, pipe, info);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(3);
    }
  });

  test('should throw only first issue', async () => {
    const pipe: PipeAsync<number> = [minValue(5), minValue(10), minValue(15)];
    const infoWithAbort = { ...info, abortPipeEarly: true };
    await expect(
      executePipeAsync<number>(0, pipe, infoWithAbort)
    ).rejects.toThrowError();
    try {
      await executePipeAsync<number>(0, pipe, infoWithAbort);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
    }
  });
});

import { describe, expect, test } from 'vitest';
import { toCustom, toCustomAsync } from '../../transformations/index.ts';
import { minValue } from '../../validations/index.ts';
import type { PipeAsync } from '../../types/index.ts';
import { pipeResultAsync } from './pipeResultAsync.ts';

describe('pipeResultAsync', () => {
  const info = { reason: 'any', origin: 'value' } as const;

  test('should execute the pipe', async () => {
    const pipe: PipeAsync<number> = [
      toCustom((input) => input + 1),
      toCustomAsync(async (input) => input * 2),
      toCustom((input) => input - 1),
    ];
    const result = await pipeResultAsync<number>(1, pipe, info, 'number');
    expect(result.output).toBe(3);
  });

  test('should return every issue', async () => {
    const pipe: PipeAsync<number> = [minValue(5), minValue(10), minValue(15)];
    expect(
      (await pipeResultAsync<number>(0, pipe, info, 'number')).issues?.length
    ).toBe(3);
  });

  test('should return only first issue', async () => {
    const pipe: PipeAsync<number> = [minValue(5), minValue(10), minValue(15)];
    const infoWithAbort = { ...info, abortPipeEarly: true };
    expect(
      (await pipeResultAsync<number>(0, pipe, infoWithAbort, 'number')).issues
        ?.length
    ).toBe(1);
  });

  test('should skip the pipeline', async () => {
    const infoWithSkip = { ...info, skipPipe: true };
    const pipe: PipeAsync<number> = [minValue(5)];
    expect(
      (await pipeResultAsync<number>(0, pipe, infoWithSkip, 'number')).output
    ).toBe(0);
  });
});

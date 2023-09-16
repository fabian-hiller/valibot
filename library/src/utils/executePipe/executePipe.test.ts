import { describe, expect, test } from 'vitest';
import { toCustom } from '../../transformations/index.ts';
import { minValue } from '../../validations/index.ts';
import type { Pipe } from '../../types.ts';
import { executePipe } from './executePipe.ts';

describe('executePipe', () => {
  const info = { reason: 'any', origin: 'value' } as const;

  test('should execute the pipe', () => {
    const pipe: Pipe<number> = [
      toCustom((input) => input + 1),
      toCustom((input) => input * 2),
      toCustom((input) => input - 1),
    ];
    const result = executePipe<number>(1, pipe, info, 'number');
    expect(result.output).toBe(3);
  });

  test('should return every issue', () => {
    const pipe: Pipe<number> = [minValue(5), minValue(10), minValue(15)];
    expect(executePipe<number>(0, pipe, info, 'number').issues?.length).toBe(3);
  });

  test('should return only first issue', () => {
    const pipe: Pipe<number> = [minValue(5), minValue(10), minValue(15)];
    const infoWithAbort = { ...info, abortPipeEarly: true };
    expect(
      executePipe<number>(0, pipe, infoWithAbort, 'number').issues?.length
    ).toBe(1);
  });

  test('should skip the pipeline', () => {
    const infoWithSkip = { ...info, skipPipes: true };
    const pipe: Pipe<number> = [minValue(5)];
    expect(executePipe<number>(0, pipe, infoWithSkip, 'number').output).toBe(0);
  });
});

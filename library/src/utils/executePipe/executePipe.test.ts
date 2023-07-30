import { describe, expect, test } from 'vitest';
import { type ValiError } from '../../error/index.ts';
import { minValue } from '../../validations/index.ts';
import type { Pipe } from '../../types.ts';
import { executePipe } from './executePipe.ts';

describe('executePipe', () => {
  const info = { reason: 'any', origin: 'key' } as const;

  test('should execute the pipe', () => {
    const pipe: Pipe<number> = [
      (input) => input + 1,
      (input) => input * 2,
      (input) => input - 1,
    ];
    const output = executePipe<number>(1, pipe, info);
    expect(output).toBe(3);
  });

  test('should throw every issue', () => {
    const pipe: Pipe<number> = [minValue(5), minValue(10), minValue(15)];
    expect(() => executePipe<number>(0, pipe, info)).toThrowError();
    try {
      executePipe<number>(0, pipe, info);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(3);
    }
  });

  test('should throw only first issue', () => {
    const pipe: Pipe<number> = [minValue(5), minValue(10), minValue(15)];
    const infoWithAbort = { ...info, abortPipeEarly: true };
    expect(() => executePipe<number>(0, pipe, infoWithAbort)).toThrowError();
    try {
      executePipe<number>(0, pipe, infoWithAbort);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
    }
  });
});

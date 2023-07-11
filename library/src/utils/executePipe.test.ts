import { describe, expect, test } from 'vitest';
import { executePipe } from './executePipe';
import type { Pipe } from '../types';

describe('executePipe', () => {
  test('should execute the pipe', () => {
    const pipe: Pipe<number> = [
      (input) => input + 1,
      (input) => input * 2,
      (input) => input - 1,
    ];
    const info = { reason: 'any', origin: 'key' } as const;
    const output = executePipe<number>(1, pipe, info);
    expect(output).toBe(3);
  });
});

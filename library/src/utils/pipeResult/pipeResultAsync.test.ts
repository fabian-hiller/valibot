import { describe, expect, test } from 'vitest';
import { toCustomAsync } from '../../transformations/index.ts';
import type { PipeAsync, SchemaIssues } from '../../types/index.ts';
import { minValue } from '../../validations/index.ts';
import { pipeResultAsync } from './pipeResultAsync.ts';

describe('await pipeResultAsync', () => {
  test('should execute the pipe', async () => {
    const pipe: PipeAsync<number> = [
      toCustomAsync(async (input) => input + 1),
      toCustomAsync(async (input) => input * 2),
      toCustomAsync(async (input) => input - 1),
    ];
    const result = await pipeResultAsync(
      { type: 'number', pipe },
      1,
      undefined
    );
    expect(result).toEqual({ typed: true, output: 3, issues: undefined });
  });

  test('should return every issue', async () => {
    const pipe: PipeAsync<number> = [minValue(5), minValue(10), minValue(15)];
    expect(
      (await pipeResultAsync({ type: 'number', pipe }, 0, undefined)).issues
        ?.length
    ).toBe(3);
    const issues: SchemaIssues = [
      {
        reason: 'number',
        context: 'min_value',
        expected: '>=1',
        received: '0',
        message: 'Invalid min value',
        input: 0,
        requirement: 1,
      },
    ];
    expect(
      (await pipeResultAsync({ type: 'number', pipe }, 0, undefined, issues))
        .issues?.length
    ).toBe(4);
  });

  test('should return only first issue', async () => {
    const pipe: PipeAsync<number> = [minValue(5), minValue(10), minValue(15)];
    expect(
      (await pipeResultAsync({ type: 'number', pipe }, 0, { abortEarly: true }))
        .issues?.length
    ).toBe(1);
    expect(
      (
        await pipeResultAsync({ type: 'number', pipe }, 0, {
          abortPipeEarly: true,
        })
      ).issues?.length
    ).toBe(1);
  });

  test('should skip the pipeline', async () => {
    const pipe: PipeAsync<number> = [minValue(5)];
    expect(
      await pipeResultAsync({ type: 'number', pipe }, 0, { skipPipe: true })
    ).toEqual({ typed: true, output: 0, issues: undefined });
  });
});

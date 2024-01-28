import { describe, expect, test } from 'vitest';
import { toCustom } from '../../transformations/index.ts';
import type { Pipe, SchemaIssues } from '../../types/index.ts';
import { minValue } from '../../validations/index.ts';
import { pipeResult } from './pipeResult.ts';

describe('pipeResult', () => {
  test('should execute the pipe', () => {
    const pipe: Pipe<number> = [
      toCustom((input) => input + 1),
      toCustom((input) => input * 2),
      toCustom((input) => input - 1),
    ];
    const result = pipeResult({ type: 'number', pipe }, 1, undefined);
    expect(result).toEqual({ typed: true, output: 3, issues: undefined });
  });

  test('should return every issue', () => {
    const pipe: Pipe<number> = [minValue(5), minValue(10), minValue(15)];
    expect(
      pipeResult({ type: 'number', pipe }, 0, undefined).issues?.length
    ).toBe(3);
    const issues: SchemaIssues = [
      {
        reason: 'number',
        validation: 'min_value',
        origin: 'value',
        expected: '>=1',
        received: '0',
        message: 'Invalid min value',
        input: 0,
        requirement: 1,
      },
    ];
    expect(
      pipeResult({ type: 'number', pipe }, 0, undefined, issues).issues?.length
    ).toBe(4);
  });

  test('should return only first issue', () => {
    const pipe: Pipe<number> = [minValue(5), minValue(10), minValue(15)];
    expect(
      pipeResult({ type: 'number', pipe }, 0, { abortEarly: true }).issues
        ?.length
    ).toBe(1);
    expect(
      pipeResult({ type: 'number', pipe }, 0, { abortPipeEarly: true }).issues
        ?.length
    ).toBe(1);
  });

  test('should skip the pipeline', () => {
    const pipe: Pipe<number> = [minValue(5)];
    expect(pipeResult({ type: 'number', pipe }, 0, { skipPipe: true })).toEqual(
      { typed: true, output: 0, issues: undefined }
    );
  });
});

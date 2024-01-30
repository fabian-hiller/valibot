import { describe, expect, test } from 'vitest';
import { ValiError } from '../../error/index.ts';
import { object, string } from '../../schemas/index.ts';
import type { Issues } from '../../types/index.ts';
import { minLength } from '../../validations/index.ts';
import { safeParse } from './safeParse.ts';

describe('safeParse', () => {
  test('should return successful output', () => {
    const input = { key: 'hello' };
    const result = safeParse(object({ key: string() }), input);
    expect(result).toEqual({
      typed: true,
      success: true,
      data: input,
      output: input,
      error: undefined,
      issues: undefined,
    });
  });

  test('should return typed output with issues', () => {
    const input = { key: 'hello' };
    const result = safeParse(object({ key: string([minLength(10)]) }), input);
    const issues: Issues = [
      {
        reason: 'string',
        validation: 'min_length',
        origin: 'value',
        message: 'Invalid length',
        input: input.key,
        requirement: 10,
        path: [
          {
            type: 'object',
            input,
            key: 'key',
            value: input.key,
          },
        ],
      },
    ];
    expect(result).toEqual({
      typed: true,
      success: false,
      data: input,
      output: input,
      error: new ValiError(issues),
      issues,
    });
  });

  test('should return type issues', () => {
    const input = { key: 123 };
    const result = safeParse(object({ key: string() }), input);
    const issues: Issues = [
      {
        reason: 'type',
        validation: 'string',
        origin: 'value',
        message: 'Invalid type',
        input: input.key,
        path: [
          {
            type: 'object',
            input,
            key: 'key',
            value: input.key,
          },
        ],
      },
    ];
    expect(result).toEqual({
      typed: false,
      success: false,
      data: input,
      output: input,
      error: new ValiError(issues),
      issues,
    });
  });
});

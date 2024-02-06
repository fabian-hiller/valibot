import { describe, expect, test } from 'vitest';
import { ValiError } from '../../error/index.ts';
import { object, string } from '../../schemas/index.ts';
import type { SchemaIssues } from '../../types/index.ts';
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
    const issues: SchemaIssues = [
      {
        reason: 'string',
        context: 'min_length',
        expected: '>=10',
        received: '5',
        message: 'Invalid length: Expected >=10 but received 5',
        input: input.key,
        requirement: 10,
        path: [
          {
            type: 'object',
            origin: 'value',
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
    const issues: SchemaIssues = [
      {
        reason: 'type',
        context: 'string',
        expected: 'string',
        received: '123',
        message: 'Invalid type: Expected string but received 123',
        input: input.key,
        path: [
          {
            type: 'object',
            origin: 'value',
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

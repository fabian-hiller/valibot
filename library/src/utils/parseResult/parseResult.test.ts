import { describe, expect, test } from 'vitest';
import type { Issues } from '../../types/index.ts';
import { parseResult } from './parseResult.ts';

describe('parseResult', () => {
  test('should return typed parse result', () => {
    const output = { test: 123 };
    expect(parseResult(true, output)).toEqual({
      typed: true,
      output,
      issues: undefined,
    });
  });

  test('should return untyped parse result', () => {
    const output = { test: 123 };
    const issues: Issues = [
      {
        reason: 'type',
        validation: 'string',
        origin: 'value',
        message: 'Invalid type',
        input: output,
      },
    ];
    expect(parseResult(false, output, issues)).toEqual({
      typed: false,
      output,
      issues,
    });
  });
});

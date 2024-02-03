import { describe, expect, test } from 'vitest';
import type { SchemaIssues } from '../../types/index.ts';
import { schemaResult } from './schemaResult.ts';

describe('schemaResult', () => {
  test('should return typed schema result', () => {
    const output = { test: 123 };
    expect(schemaResult(true, output)).toEqual({
      typed: true,
      output,
      issues: undefined,
    });
  });

  test('should return untyped schema result', () => {
    const output = { test: 123 };
    const issues: SchemaIssues = [
      {
        reason: 'type',
        context: 'string',
        origin: 'value',
        expected: 'string',
        received: 'Object',
        message: 'Invalid type',
        input: output,
      },
    ];
    expect(schemaResult(false, output, issues)).toEqual({
      typed: false,
      output,
      issues,
    });
  });
});

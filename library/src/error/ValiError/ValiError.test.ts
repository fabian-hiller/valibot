import { describe, expect, test } from 'vitest';
import type { SchemaIssue } from '../../types/index.ts';
import { ValiError } from './ValiError.ts';

describe('ValiError', () => {
  test('should create error instance', () => {
    const issue: SchemaIssue = {
      reason: 'type',
      context: 'string',
      origin: 'value',
      input: 1,
      expected: 'string',
      received: 'number',
      message: 'Invalid type',
    };
    const error = new ValiError([issue, issue]);
    expect(error).toBeInstanceOf(ValiError);
    expect(error.name).toBe('ValiError');
    expect(error.message).toBe('Invalid type');
    expect(error.issues).toEqual([issue, issue]);
  });
});

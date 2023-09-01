import { describe, expect, test } from 'vitest';

import { ValiError } from './ValiError.ts';

describe('ValiError', () => {
  test('should create error instance', () => {
    const issue = {
      reason: 'type' as const,
      validation: 'string',
      origin: 'value' as const,
      message: 'Invalid type',
      input: 1,
    };
    const error = new ValiError([issue, issue]);
    expect(error).toBeInstanceOf(ValiError);
    expect(error.name).toBe('ValiError');
    expect(error.message).toBe('Invalid type');
    expect(error.issues).toEqual([issue, issue]);
  });

  test('should create error instance function message', () => {
    const errorMessage = 'Invalid type';
    const issue = {
      reason: 'type' as const,
      validation: 'string',
      origin: 'value' as const,
      message: () => errorMessage,
      input: 1,
    };
    const error = new ValiError([issue, issue]);
    expect(error).toBeInstanceOf(ValiError);
    expect(error.name).toBe('ValiError');
    expect(error.message).toBe(errorMessage);
    expect(error.issues).toEqual([issue, issue]);
  });
});

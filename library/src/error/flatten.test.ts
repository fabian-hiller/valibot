import { describe, expect, test } from 'vitest';
import { ValiError } from './ValiError';
import { flatten } from './flatten';

describe('flatten', () => {
  const rootIssue = {
    reason: 'type' as const,
    validation: 'string',
    origin: 'value' as const,
    message: 'Invalid type',
    input: 1,
  };

  const nestedIssue = {
    reason: 'type' as const,
    validation: 'string',
    origin: 'value' as const,
    message: 'Invalid type',
    input: { test: 1 },
    path: [
      {
        schema: 'object' as const,
        input: { test: 1 },
        key: 'test',
        value: 1,
      },
    ],
  };

  test('should flatten only root error', () => {
    const error = new ValiError([rootIssue]);
    const flatError = flatten(error);
    expect(flatError).toEqual({
      root: [rootIssue.message],
      nested: {},
    });
  });

  test('should flatten only nested error', () => {
    const error = new ValiError([nestedIssue]);
    const flatError = flatten(error);
    expect(flatError).toEqual({
      nested: {
        test: [nestedIssue.message],
      },
    });
  });

  test('should flatten root and nested error', () => {
    const error = new ValiError([rootIssue, nestedIssue]);
    const flatError = flatten(error);
    expect(flatError).toEqual({
      root: [rootIssue.message],
      nested: {
        test: [nestedIssue.message],
      },
    });
  });
});

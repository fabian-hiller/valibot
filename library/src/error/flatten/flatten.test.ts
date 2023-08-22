import { describe, expect, test } from 'vitest';
import type { Issues } from '../../types.ts';
import { ValiError } from '../ValiError/index.ts';
import { flatten } from './flatten.ts';

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
    const issues: Issues = [rootIssue];
    const flatError = {
      root: [rootIssue.message],
      nested: {},
    };

    const error = new ValiError(issues);
    const output1 = flatten(error);
    expect(output1).toEqual(flatError);

    const output2 = flatten(issues);
    expect(output2).toEqual(flatError);
  });

  test('should flatten only nested error', () => {
    const issues: Issues = [nestedIssue];
    const flatError = {
      nested: {
        test: [nestedIssue.message],
      },
    };

    const error = new ValiError(issues);
    const output1 = flatten(error);
    expect(output1).toEqual(flatError);

    const output2 = flatten(issues);
    expect(output2).toEqual(flatError);
  });

  test('should flatten root and nested error', () => {
    const issues: Issues = [rootIssue, nestedIssue];
    const flatError = {
      root: [rootIssue.message],
      nested: {
        test: [nestedIssue.message],
      },
    };

    const error = new ValiError(issues);
    const output1 = flatten(error);
    expect(output1).toEqual(flatError);

    const output2 = flatten(issues);
    expect(output2).toEqual(flatError);
  });
});

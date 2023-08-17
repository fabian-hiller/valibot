import { describe, expect, test } from 'vitest';
import {
  type Issues,
  ValiError,
  type LeafIssue,
  type NestedIssue,
} from '../ValiError/index.ts';
import { flatten } from './flatten.ts';

describe('flatten', () => {
  const rootIssue: LeafIssue = {
    type: 'leaf',
    reason: 'type' as const,
    validation: 'string',
    message: 'Invalid type',
    input: 1,
  };

  const nestedIssue: NestedIssue = {
    type: 'nested',
    origin: 'value' as const,
    path: 'test',
    issues: [
      {
        type: 'leaf',
        reason: 'type' as const,
        validation: 'string',
        message: 'Invalid type',
        input: 1,
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
        test: [(nestedIssue.issues[0] as LeafIssue).message],
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
        test: [(nestedIssue.issues[0] as LeafIssue).message],
      },
    };

    const error = new ValiError(issues);
    const output1 = flatten(error);
    expect(output1).toEqual(flatError);

    const output2 = flatten(issues);
    expect(output2).toEqual(flatError);
  });
});

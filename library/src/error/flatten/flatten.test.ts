import { describe, expect, test } from 'vitest';
import type { Issue, Issues } from '../../types/index.ts';
import { ValiError } from '../ValiError/index.ts';
import { flatten } from './flatten.ts';

describe('flatten', () => {
  const rootIssue: Issue = {
    reason: 'object',
    validation: 'custom',
    origin: 'value',
    message: 'Custom error',
    input: { key1: 'test', key2: ['test'] },
  };

  const nestedIssue1: Issue = {
    reason: 'string',
    validation: 'email',
    origin: 'value',
    message: 'Invalid email',
    input: { key1: 'test', key2: ['test'] },
    path: [
      {
        type: 'object',
        input: { key1: 'test', key2: ['test'] },
        key: 'key1',
        value: 'test',
      },
    ],
  };

  const nestedIssue2: Issue = {
    reason: 'string',
    validation: 'ends_with',
    origin: 'value',
    message: 'Invalid end',
    input: { key1: 'test', key2: ['test'] },
    path: [
      {
        type: 'object',
        input: { key1: 'test', key2: ['test'] },
        key: 'key1',
        value: 'test',
      },
    ],
  };

  const nestedIssue3: Issue = {
    reason: 'type',
    validation: 'number',
    origin: 'value',
    message: 'Invalid type',
    input: { key1: 'test', key2: ['test'] },
    path: [
      {
        type: 'object',
        input: { key1: 'test', key2: ['test'] },
        key: 'key2',
        value: ['test'],
      },
      {
        type: 'array',
        input: ['test'],
        key: 0,
        value: 'test',
      },
    ],
  };

  test('should flatten only root error', () => {
    const issues: Issues = [rootIssue, rootIssue];
    const flatError = {
      root: [rootIssue.message, rootIssue.message],
      nested: {},
    };

    const error = new ValiError(issues);
    const output1 = flatten(error);
    expect(output1).toEqual(flatError);

    const output2 = flatten(issues);
    expect(output2).toEqual(flatError);
  });

  test('should flatten only nested error', () => {
    const issues: Issues = [nestedIssue1, nestedIssue2, nestedIssue3];
    const flatError = {
      nested: {
        key1: [nestedIssue1.message, nestedIssue2.message],
        'key2.0': [nestedIssue3.message],
      },
    };

    const error = new ValiError(issues);
    const output1 = flatten(error);
    expect(output1).toEqual(flatError);

    const output2 = flatten(issues);
    expect(output2).toEqual(flatError);
  });

  test('should flatten root and nested error', () => {
    const issues: Issues = [rootIssue, nestedIssue1];
    const flatError = {
      root: [rootIssue.message],
      nested: {
        key1: [nestedIssue1.message],
      },
    };

    const error = new ValiError(issues);
    const output1 = flatten(error);
    expect(output1).toEqual(flatError);

    const output2 = flatten(issues);
    expect(output2).toEqual(flatError);
  });
});

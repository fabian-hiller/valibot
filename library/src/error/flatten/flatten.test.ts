import { describe, expect, test } from 'vitest';
import type { SchemaIssue, SchemaIssues } from '../../types/index.ts';
import { ValiError } from '../ValiError/index.ts';
import { flatten } from './flatten.ts';

describe('flatten', () => {
  const rootIssue: SchemaIssue = {
    reason: 'object',
    context: 'custom',
    origin: 'value',
    input: { key1: 'test', key2: ['test'] },
    expected: null,
    received: 'Object',
    message: 'Custom error',
  };

  const nestedIssue1: SchemaIssue = {
    reason: 'string',
    context: 'email',
    origin: 'value',
    input: { key1: 'test', key2: ['test'] },
    expected: 'email',
    received: '"test"',
    message: 'Invalid email',
    path: [
      {
        type: 'object',
        input: { key1: 'test', key2: ['test'] },
        key: 'key1',
        value: 'test',
      },
    ],
  };

  const nestedIssue2: SchemaIssue = {
    reason: 'string',
    context: 'ends_with',
    origin: 'value',
    input: { key1: 'test', key2: ['test'] },
    expected: '"@gmail.com"',
    received: '"test"',
    message: 'Invalid end',
    path: [
      {
        type: 'object',
        input: { key1: 'test', key2: ['test'] },
        key: 'key1',
        value: 'test',
      },
    ],
  };

  const nestedIssue3: SchemaIssue = {
    reason: 'type',
    context: 'number',
    origin: 'value',
    input: { key1: 'test', key2: ['test'] },
    expected: 'number',
    received: '"test"',
    message: 'Invalid type',
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
    const issues: SchemaIssues = [rootIssue, rootIssue];
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
    const issues: SchemaIssues = [nestedIssue1, nestedIssue2, nestedIssue3];
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
    const issues: SchemaIssues = [rootIssue, nestedIssue1];
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

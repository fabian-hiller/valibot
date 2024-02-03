import { describe, expect, test } from 'vitest';
import { any, string } from '../../schemas/index.ts';
import type { PathItem, SchemaIssues } from '../../types/index.ts';
import { schemaIssue } from './schemaIssue.ts';

describe('schemaIssue', () => {
  test('should return results with issues', () => {
    const context1 = {
      type: 'string',
      expects: 'string',
      message: undefined,
    };
    const reference1 = string;
    const input1 = 123;
    const received1 = '123';
    expect(schemaIssue(context1, reference1, input1, undefined)).toEqual({
      typed: false,
      output: input1,
      issues: [
        {
          reason: 'type',
          context: context1.type,
          origin: 'value',
          expected: context1.expects,
          received: received1,
          message: `Invalid type: Expected ${context1.expects} but received ${received1}`,
          input: 123,
        },
      ],
    });

    const context2 = {
      type: 'any',
      expects: '1234',
      message: 'Custom message',
    };
    const reference2 = any;
    const config2 = {
      origin: 'key' as const,
      lang: 'en',
      abortEarly: true,
      abortPipeEarly: false,
      skipPipe: false,
    };
    const input2 = { abc: 123 };
    const other2 = {
      reason: 'any' as const,
      path: [
        {
          type: 'unknown',
          input: 'input',
          key: 'key',
          value: 'value',
        },
      ] satisfies PathItem[],
      issues: [
        {
          reason: 'any',
          context: 'validation',
          origin: 'value',
          expected: 'expected',
          received: 'received',
          message: 'message',
          input: 'input',
        },
      ] satisfies SchemaIssues,
    };
    const received2 = 'Object';
    const result2 = schemaIssue(context2, reference2, input2, config2, other2);
    expect(result2).toEqual({
      typed: false,
      output: input2,
      issues: [
        {
          reason: other2.reason,
          context: context2.type,
          origin: config2.origin,
          expected: context2.expects,
          received: received2,
          message: context2.message,
          input: input2,
          issues: other2.issues,
          path: other2.path,
          lang: config2.lang,
          abortEarly: config2.abortEarly,
          abortPipeEarly: config2.abortPipeEarly,
          skipPipe: config2.skipPipe,
        },
      ] satisfies SchemaIssues,
    });
  });
});

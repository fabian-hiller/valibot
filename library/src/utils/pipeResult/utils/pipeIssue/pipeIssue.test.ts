import { describe, expect, test } from 'vitest';
import type { SchemaConfig } from '../../../../types/index.ts';
import type { PipeActionIssue, SchemaIssue } from '../../../../types/issues.ts';
import { minLength, value } from '../../../../validations/index.ts';
import { pipeIssue } from './pipeIssue.ts';

describe('pipeIssue', () => {
  test('should return issue object', () => {
    const schemaContext = { type: 'string' } as const;
    const actionIssue1: PipeActionIssue = {
      context: {
        type: 'min_length',
        expects: '>=10',
        message: undefined,
        requirement: 10,
      },
      reference: minLength,
      input: 'hello',
      label: 'length',
      received: '5',
      path: [
        {
          type: 'object',
          origin: 'value',
          input: { key: 'hello' },
          key: 'key',
          value: 'hello',
        },
      ],
    };

    expect(pipeIssue(schemaContext, undefined, actionIssue1)).toEqual({
      reason: schemaContext.type,
      context: actionIssue1.context.type,
      expected: actionIssue1.context.expects,
      received: actionIssue1.received!,
      message: `Invalid ${actionIssue1.label}: Expected ${actionIssue1.context.expects} but received ${actionIssue1.received}`,
      input: actionIssue1.input,
      requirement: actionIssue1.context.requirement,
      path: actionIssue1.path,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
      skipPipe: undefined,
    } satisfies SchemaIssue);

    const actionIssue2: PipeActionIssue = {
      context: {
        type: 'value',
        expects: '"key"',
        message: 'Custom message',
        requirement: 'key',
      },
      reference: value,
      input: 'hello',
      label: 'value',
      received: '"hello"',
      path: [
        {
          type: 'record',
          origin: 'value',
          input: { hello: 123 },
          key: 'hello',
          value: 123,
        },
      ],
    };
    const schemaConfig: SchemaConfig = {
      lang: 'en',
      abortEarly: true,
      abortPipeEarly: false,
      skipPipe: false,
    };

    expect(pipeIssue(schemaContext, schemaConfig, actionIssue2)).toEqual({
      reason: schemaContext.type,
      context: actionIssue2.context.type,
      expected: actionIssue2.context.expects,
      received: actionIssue2.received!,
      message: actionIssue2.context.message as string,
      input: actionIssue2.input,
      requirement: actionIssue2.context.requirement,
      path: actionIssue2.path,
      lang: schemaConfig.lang,
      abortEarly: schemaConfig.abortEarly,
      abortPipeEarly: schemaConfig.abortPipeEarly,
      skipPipe: schemaConfig.skipPipe,
    } satisfies SchemaIssue);
  });
});

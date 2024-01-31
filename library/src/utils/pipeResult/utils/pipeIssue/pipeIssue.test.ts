import { describe, expect, test } from 'vitest';
import type { PipeActionIssue, SchemaIssue } from '../../../../types/issues.ts';
import type { ParseConfig } from '../../../../types/schema.ts';
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
      path: [],
    };

    expect(pipeIssue(schemaContext, undefined, actionIssue1)).toEqual({
      reason: schemaContext.type,
      validation: actionIssue1.context.type,
      origin: 'value',
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
        { type: 'record', input: { hello: 123 }, key: 'hello', value: 123 },
      ],
    };
    const parseConfig: ParseConfig = {
      origin: 'key',
      lang: 'en',
      abortEarly: true,
      abortPipeEarly: false,
      skipPipe: false,
    };

    expect(pipeIssue(schemaContext, parseConfig, actionIssue2)).toEqual({
      reason: schemaContext.type,
      validation: actionIssue2.context.type,
      origin: parseConfig.origin!,
      expected: actionIssue2.context.expects,
      received: actionIssue2.received!,
      message: actionIssue2.context.message as string,
      input: actionIssue2.input,
      requirement: actionIssue2.context.requirement,
      path: actionIssue2.path,
      lang: parseConfig.lang,
      abortEarly: parseConfig.abortEarly,
      abortPipeEarly: parseConfig.abortPipeEarly,
      skipPipe: parseConfig.skipPipe,
    } satisfies SchemaIssue);
  });
});

import { describe, expect, test } from 'vitest';
import { transform } from '../../actions/index.ts';
import { pipeAsync } from '../../methods/index.ts';
import type { FailureDataset } from '../../types/index.ts';
import {
  expectNoSchemaIssueAsync,
  expectSchemaIssueAsync,
} from '../../vitest/index.ts';
import { nullishAsync, type NullishSchemaAsync } from '../nullish/index.ts';
import { string, type StringSchema } from '../string/index.ts';
import {
  nonOptionalAsync,
  type NonOptionalSchemaAsync,
} from './nonOptionalAsync.ts';
import type { NonOptionalIssue } from './types.ts';

describe('nonOptionalAsync', () => {
  describe('should return schema object', () => {
    const wrapped = nullishAsync(string());
    const baseSchema: Omit<
      NonOptionalSchemaAsync<
        NullishSchemaAsync<StringSchema<undefined>, undefined>,
        never
      >,
      'message'
    > = {
      kind: 'schema',
      type: 'non_optional',
      reference: nonOptionalAsync,
      expects: '!undefined',
      wrapped,
      async: true,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: NonOptionalSchemaAsync<
        NullishSchemaAsync<StringSchema<undefined>, undefined>,
        undefined
      > = {
        ...baseSchema,
        message: undefined,
      };
      expect(nonOptionalAsync(wrapped)).toStrictEqual(schema);
      expect(nonOptionalAsync(wrapped, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(nonOptionalAsync(wrapped, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies NonOptionalSchemaAsync<
        NullishSchemaAsync<StringSchema<undefined>, undefined>,
        'message'
      >);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(nonOptionalAsync(wrapped, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies NonOptionalSchemaAsync<
        NullishSchemaAsync<StringSchema<undefined>, undefined>,
        typeof message
      >);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = nonOptionalAsync(nullishAsync(string()));

    test('for valid wrapped types', async () => {
      await expectNoSchemaIssueAsync(schema, ['', 'foo', '#$%', null]);
    });
  });

  describe('should return dataset with issues', () => {
    const nonOptionalIssue: NonOptionalIssue = {
      kind: 'schema',
      type: 'non_optional',
      input: undefined,
      received: 'undefined',
      expected: '!undefined',
      message: 'message',
      requirement: undefined,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for undefined input', async () => {
      await expectSchemaIssueAsync(
        nonOptionalAsync(nullishAsync(string()), 'message'),
        nonOptionalIssue,
        [undefined]
      );
    });

    test('for undefined output', async () => {
      expect(
        await nonOptionalAsync(
          pipeAsync(
            string(),
            transform(() => undefined)
          ),
          'message'
        )['~run']({ value: 'foo' }, {})
      ).toStrictEqual({
        typed: false,
        value: undefined,
        issues: [nonOptionalIssue],
      } satisfies FailureDataset<NonOptionalIssue>);
    });
  });
});

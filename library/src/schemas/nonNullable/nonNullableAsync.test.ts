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
  nonNullableAsync,
  type NonNullableSchemaAsync,
} from './nonNullableAsync.ts';
import type { NonNullableIssue } from './types.ts';

describe('nonNullableAsync', () => {
  describe('should return schema object', () => {
    const wrapped = nullishAsync(string());
    const baseSchema: Omit<
      NonNullableSchemaAsync<
        NullishSchemaAsync<StringSchema<undefined>, undefined>,
        never
      >,
      'message'
    > = {
      kind: 'schema',
      type: 'non_nullable',
      reference: nonNullableAsync,
      expects: '!null',
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
      const schema: NonNullableSchemaAsync<
        NullishSchemaAsync<StringSchema<undefined>, undefined>,
        undefined
      > = {
        ...baseSchema,
        message: undefined,
      };
      expect(nonNullableAsync(wrapped)).toStrictEqual(schema);
      expect(nonNullableAsync(wrapped, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(nonNullableAsync(wrapped, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies NonNullableSchemaAsync<
        NullishSchemaAsync<StringSchema<undefined>, undefined>,
        'message'
      >);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(nonNullableAsync(wrapped, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies NonNullableSchemaAsync<
        NullishSchemaAsync<StringSchema<undefined>, undefined>,
        typeof message
      >);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = nonNullableAsync(nullishAsync(string()));

    test('for valid wrapped types', async () => {
      await expectNoSchemaIssueAsync(schema, ['', 'foo', '#$%', undefined]);
    });
  });

  describe('should return dataset with issues', () => {
    const nonNullableIssue: NonNullableIssue = {
      kind: 'schema',
      type: 'non_nullable',
      input: null,
      received: 'null',
      expected: '!null',
      message: 'message',
      requirement: undefined,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for null input', async () => {
      await expectSchemaIssueAsync(
        nonNullableAsync(nullishAsync(string()), 'message'),
        nonNullableIssue,
        [null]
      );
    });

    test('for null output', async () => {
      expect(
        await nonNullableAsync(
          pipeAsync(
            string(),
            transform(() => null)
          ),
          'message'
        )['~run']({ value: 'foo' }, {})
      ).toStrictEqual({
        typed: false,
        value: null,
        issues: [nonNullableIssue],
      } satisfies FailureDataset<NonNullableIssue>);
    });
  });
});

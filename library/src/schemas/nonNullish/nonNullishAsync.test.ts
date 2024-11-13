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
  nonNullishAsync,
  type NonNullishSchemaAsync,
} from './nonNullishAsync.ts';
import type { NonNullishIssue } from './types.ts';

describe('nonNullishAsync', () => {
  describe('should return schema object', () => {
    const wrapped = nullishAsync(string());
    const baseSchema: Omit<
      NonNullishSchemaAsync<
        NullishSchemaAsync<StringSchema<undefined>, undefined>,
        never
      >,
      'message'
    > = {
      kind: 'schema',
      type: 'non_nullish',
      reference: nonNullishAsync,
      expects: '(!null & !undefined)',
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
      const schema: NonNullishSchemaAsync<
        NullishSchemaAsync<StringSchema<undefined>, undefined>,
        undefined
      > = {
        ...baseSchema,
        message: undefined,
      };
      expect(nonNullishAsync(wrapped)).toStrictEqual(schema);
      expect(nonNullishAsync(wrapped, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(nonNullishAsync(wrapped, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies NonNullishSchemaAsync<
        NullishSchemaAsync<StringSchema<undefined>, undefined>,
        'message'
      >);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(nonNullishAsync(wrapped, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies NonNullishSchemaAsync<
        NullishSchemaAsync<StringSchema<undefined>, undefined>,
        typeof message
      >);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = nonNullishAsync(nullishAsync(string()));

    test('for valid wrapped types', async () => {
      await expectNoSchemaIssueAsync(schema, ['', 'foo', '#$%']);
    });
  });

  describe('should return dataset with issues', () => {
    const baseIssue: Omit<NonNullishIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'non_nullish',
      expected: '(!null & !undefined)',
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
        nonNullishAsync(nullishAsync(string()), 'message'),
        baseIssue,
        [null]
      );
    });

    test('for undefined input', async () => {
      await expectSchemaIssueAsync(
        nonNullishAsync(nullishAsync(string()), 'message'),
        baseIssue,
        [undefined]
      );
    });

    test('for null output', async () => {
      expect(
        await nonNullishAsync(
          pipeAsync(
            string(),
            transform(() => null)
          ),
          'message'
        )['~run']({ value: 'foo' }, {})
      ).toStrictEqual({
        typed: false,
        value: null,
        issues: [{ ...baseIssue, input: null, received: 'null' }],
      } satisfies FailureDataset<NonNullishIssue>);
    });

    test('for undefined output', async () => {
      expect(
        await nonNullishAsync(
          pipeAsync(
            string(),
            transform(() => undefined)
          ),
          'message'
        )['~run']({ value: 'foo' }, {})
      ).toStrictEqual({
        typed: false,
        value: undefined,
        issues: [{ ...baseIssue, input: undefined, received: 'undefined' }],
      } satisfies FailureDataset<NonNullishIssue>);
    });
  });
});

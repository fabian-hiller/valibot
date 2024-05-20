import { describe, expect, test } from 'vitest';
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
      _run: expect.any(Function),
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
    const schema = nonNullableAsync(nullishAsync(string()), 'message');
    const baseIssue: Omit<NonNullableIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'non_nullable',
      expected: '!null',
      message: 'message',
    };

    test('for null', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [null]);
    });
  });
});

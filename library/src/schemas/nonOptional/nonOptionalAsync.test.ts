import { describe, expect, test } from 'vitest';
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
      _run: expect.any(Function),
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
    const schema = nonOptionalAsync(nullishAsync(string()), 'message');
    const baseIssue: Omit<NonOptionalIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'non_optional',
      expected: '!undefined',
      message: 'message',
    };

    test('for undefined', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [undefined]);
    });
  });
});

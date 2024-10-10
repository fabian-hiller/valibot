import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import { nullish, type NullishSchema } from '../nullish/index.ts';
import { string, type StringSchema } from '../string/index.ts';
import { nonNullable, type NonNullableSchema } from './nonNullable.ts';
import type { NonNullableIssue } from './types.ts';

describe('nonNullable', () => {
  describe('should return schema object', () => {
    const wrapped = nullish(string());
    const baseSchema: Omit<
      NonNullableSchema<
        NullishSchema<StringSchema<undefined>, undefined>,
        never
      >,
      'message'
    > = {
      kind: 'schema',
      type: 'non_nullable',
      reference: nonNullable,
      expects: '!null',
      wrapped,
      async: false,
      '~standard': 1,
      '~vendor': 'valibot',
      '~validate': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: NonNullableSchema<
        NullishSchema<StringSchema<undefined>, undefined>,
        undefined
      > = {
        ...baseSchema,
        message: undefined,
      };
      expect(nonNullable(wrapped)).toStrictEqual(schema);
      expect(nonNullable(wrapped, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(nonNullable(wrapped, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies NonNullableSchema<
        NullishSchema<StringSchema<undefined>, undefined>,
        'message'
      >);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(nonNullable(wrapped, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies NonNullableSchema<
        NullishSchema<StringSchema<undefined>, undefined>,
        typeof message
      >);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = nonNullable(nullish(string()));

    test('for valid wrapped types', () => {
      expectNoSchemaIssue(schema, ['', 'foo', '#$%', undefined]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = nonNullable(nullish(string()), 'message');
    const baseIssue: Omit<NonNullableIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'non_nullable',
      expected: '!null',
      message: 'message',
    };

    test('for null', () => {
      expectSchemaIssue(schema, baseIssue, [null]);
    });
  });
});

import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import { nullish, type NullishSchema } from '../nullish/index.ts';
import { string, type StringSchema } from '../string/index.ts';
import { nonNullish, type NonNullishSchema } from './nonNullish.ts';
import type { NonNullishIssue } from './types.ts';

describe('nonNullish', () => {
  describe('should return schema object', () => {
    const wrapped = nullish(string());
    const baseSchema: Omit<
      NonNullishSchema<
        NullishSchema<StringSchema<undefined>, undefined>,
        never
      >,
      'message'
    > = {
      kind: 'schema',
      type: 'non_nullish',
      reference: nonNullish,
      expects: '!null & !undefined',
      wrapped,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: NonNullishSchema<
        NullishSchema<StringSchema<undefined>, undefined>,
        undefined
      > = {
        ...baseSchema,
        message: undefined,
      };
      expect(nonNullish(wrapped)).toStrictEqual(schema);
      expect(nonNullish(wrapped, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(nonNullish(wrapped, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies NonNullishSchema<
        NullishSchema<StringSchema<undefined>, undefined>,
        'message'
      >);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(nonNullish(wrapped, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies NonNullishSchema<
        NullishSchema<StringSchema<undefined>, undefined>,
        typeof message
      >);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = nonNullish(nullish(string()));

    test('for valid wrapped types', () => {
      expectNoSchemaIssue(schema, ['', 'foo', '#$%']);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = nonNullish(nullish(string()), 'message');
    const baseIssue: Omit<NonNullishIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'non_nullish',
      expected: '!null & !undefined',
      message: 'message',
    };

    test('for null', () => {
      expectSchemaIssue(schema, baseIssue, [null]);
    });

    test('for undefined', () => {
      expectSchemaIssue(schema, baseIssue, [undefined]);
    });
  });
});

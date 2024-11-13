import { describe, expect, test } from 'vitest';
import { transform } from '../../actions/index.ts';
import { pipe } from '../../methods/index.ts';
import type { FailureDataset } from '../../types/index.ts';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import { nullish, type NullishSchema } from '../nullish/index.ts';
import { string, type StringSchema } from '../string/index.ts';
import { nonOptional, type NonOptionalSchema } from './nonOptional.ts';
import type { NonOptionalIssue } from './types.ts';

describe('nonOptional', () => {
  describe('should return schema object', () => {
    const wrapped = nullish(string());
    const baseSchema: Omit<
      NonOptionalSchema<
        NullishSchema<StringSchema<undefined>, undefined>,
        never
      >,
      'message'
    > = {
      kind: 'schema',
      type: 'non_optional',
      reference: nonOptional,
      expects: '!undefined',
      wrapped,
      async: false,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: NonOptionalSchema<
        NullishSchema<StringSchema<undefined>, undefined>,
        undefined
      > = {
        ...baseSchema,
        message: undefined,
      };
      expect(nonOptional(wrapped)).toStrictEqual(schema);
      expect(nonOptional(wrapped, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(nonOptional(wrapped, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies NonOptionalSchema<
        NullishSchema<StringSchema<undefined>, undefined>,
        'message'
      >);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(nonOptional(wrapped, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies NonOptionalSchema<
        NullishSchema<StringSchema<undefined>, undefined>,
        typeof message
      >);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = nonOptional(nullish(string()));

    test('for valid wrapped types', () => {
      expectNoSchemaIssue(schema, ['', 'foo', '#$%', null]);
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

    test('for undefined input', () => {
      expectSchemaIssue(
        nonOptional(nullish(string()), 'message'),
        nonOptionalIssue,
        [undefined]
      );
    });

    test('for undefined output', () => {
      expect(
        nonOptional(
          pipe(
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

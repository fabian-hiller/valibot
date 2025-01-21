import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import { exactOptional, type ExactOptionalSchema } from './exactOptional.ts';

describe('exactOptional', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<
      ExactOptionalSchema<StringSchema<undefined>, string>,
      'default'
    > = {
      kind: 'schema',
      type: 'exact_optional',
      reference: exactOptional,
      expects: 'string',
      wrapped: {
        ...string(),
        '~standard': {
          version: 1,
          vendor: 'valibot',
          validate: expect.any(Function),
        },
        '~run': expect.any(Function),
      },
      async: false,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    test('with undefined default', () => {
      const expected: ExactOptionalSchema<
        StringSchema<undefined>,
        undefined
      > = {
        ...baseSchema,
        default: undefined,
      };
      expect(exactOptional(string())).toStrictEqual(expected);
      expect(exactOptional(string(), undefined)).toStrictEqual(expected);
    });

    test('with value default', () => {
      expect(exactOptional(string(), 'foo')).toStrictEqual({
        ...baseSchema,
        default: 'foo',
      } satisfies ExactOptionalSchema<StringSchema<undefined>, 'foo'>);
    });

    test('with value getter default', () => {
      const getter = () => 'foo';
      expect(exactOptional(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies ExactOptionalSchema<StringSchema<undefined>, typeof getter>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = exactOptional(string());

    test('for wrapper type', () => {
      expectNoSchemaIssue(schema, ['', 'foo', '#$%']);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = exactOptional(string('message'));
    const baseIssue: Omit<StringIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'string',
      expected: 'string',
      message: 'message',
    };

    test('for invalid wrapper type', () => {
      expectSchemaIssue(schema, baseIssue, [123, true, {}]);
    });

    test('for null', () => {
      expectSchemaIssue(schema, baseIssue, [null]);
    });

    test('for undefined', () => {
      expectSchemaIssue(schema, baseIssue, [undefined]);
    });
  });

  describe('should return dataset without default', () => {
    test('for undefined default', () => {
      expectNoSchemaIssue(exactOptional(string()), ['foo']);
      expectNoSchemaIssue(exactOptional(string(), undefined), ['foo']);
    });

    test('for wrapper type', () => {
      expectNoSchemaIssue(exactOptional(string(), 'foo'), ['', 'bar', '#$%']);
    });
  });
});

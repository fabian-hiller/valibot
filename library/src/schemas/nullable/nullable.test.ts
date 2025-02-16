import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import { nullable, type NullableSchema } from './nullable.ts';

describe('nullable', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<
      NullableSchema<StringSchema<undefined>, string>,
      'default'
    > = {
      kind: 'schema',
      type: 'nullable',
      reference: nullable,
      expects: '(string | null)',
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
      const expected: NullableSchema<StringSchema<undefined>, undefined> = {
        ...baseSchema,
        default: undefined,
      };
      expect(nullable(string())).toStrictEqual(expected);
      expect(nullable(string(), undefined)).toStrictEqual(expected);
    });

    test('with null default', () => {
      expect(nullable(string(), null)).toStrictEqual({
        ...baseSchema,
        default: null,
      } satisfies NullableSchema<StringSchema<undefined>, null>);
    });

    test('with null getter default', () => {
      const getter = () => null;
      expect(nullable(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies NullableSchema<StringSchema<undefined>, typeof getter>);
    });

    test('with value default', () => {
      expect(nullable(string(), 'foo')).toStrictEqual({
        ...baseSchema,
        default: 'foo',
      } satisfies NullableSchema<StringSchema<undefined>, 'foo'>);
    });

    test('with value getter default', () => {
      const getter = () => 'foo';
      expect(nullable(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies NullableSchema<StringSchema<undefined>, typeof getter>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = nullable(string());

    test('for wrapper type', () => {
      expectNoSchemaIssue(schema, ['', 'foo', '#$%']);
    });

    test('for null', () => {
      expectNoSchemaIssue(schema, [null]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = nullable(string('message'));
    const baseIssue: Omit<StringIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'string',
      expected: 'string',
      message: 'message',
    };

    test('for invalid wrapper type', () => {
      expectSchemaIssue(schema, baseIssue, [123, true, {}]);
    });

    test('for undefined', () => {
      expectSchemaIssue(schema, baseIssue, [undefined]);
    });
  });

  describe('should return dataset without default', () => {
    test('for undefined default', () => {
      expectNoSchemaIssue(nullable(string()), [null, 'foo']);
      expectNoSchemaIssue(nullable(string(), undefined), [null, 'foo']);
    });

    test('for wrapper type', () => {
      expectNoSchemaIssue(nullable(string(), 'foo'), ['', 'bar', '#$%']);
    });
  });

  describe('should return dataset with default', () => {
    const schema1 = nullable(string(), null);
    const schema2 = nullable(string(), 'foo');
    const schema3 = nullable(string(), () => null);
    const schema4 = nullable(string(), () => 'foo');

    test('for null', () => {
      expect(schema1['~run']({ value: null }, {})).toStrictEqual({
        typed: true,
        value: null,
      });
      expect(schema2['~run']({ value: null }, {})).toStrictEqual({
        typed: true,
        value: 'foo',
      });
      expect(schema3['~run']({ value: null }, {})).toStrictEqual({
        typed: true,
        value: null,
      });
      expect(schema4['~run']({ value: null }, {})).toStrictEqual({
        typed: true,
        value: 'foo',
      });
    });
  });
});

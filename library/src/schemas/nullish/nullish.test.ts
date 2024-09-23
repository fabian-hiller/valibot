import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue } from '../../vitest/index.ts';
import { string, type StringSchema } from '../string/index.ts';
import { nullish, type NullishSchema } from './nullish.ts';

describe('nullish', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<
      NullishSchema<StringSchema<undefined>, string>,
      'default'
    > = {
      kind: 'schema',
      type: 'nullish',
      reference: nullish,
      expects: '(string | null | undefined)',
      wrapped: {
        ...string(),
        '~standard': 1,
        '~vendor': 'valibot',
        '~validate': expect.any(Function),
      },
      async: false,
      '~standard': 1,
      '~vendor': 'valibot',
      '~validate': expect.any(Function),
    };

    test('with never default', () => {
      expect(nullish(string())).toStrictEqual(baseSchema);
    });

    test('with null default', () => {
      expect(nullish(string(), null)).toStrictEqual({
        ...baseSchema,
        default: null,
      } satisfies NullishSchema<StringSchema<undefined>, null>);
    });

    test('with null getter default', () => {
      const getter = () => null;
      expect(nullish(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies NullishSchema<StringSchema<undefined>, typeof getter>);
    });

    test('with undefined default', () => {
      expect(nullish(string(), undefined)).toStrictEqual({
        ...baseSchema,
        default: undefined,
      } satisfies NullishSchema<StringSchema<undefined>, undefined>);
    });

    test('with value getter default', () => {
      const getter = () => 'foo';
      expect(nullish(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies NullishSchema<StringSchema<undefined>, typeof getter>);
    });

    test('with value default', () => {
      expect(nullish(string(), 'foo')).toStrictEqual({
        ...baseSchema,
        default: 'foo',
      } satisfies NullishSchema<StringSchema<undefined>, 'foo'>);
    });

    test('with value getter default', () => {
      const getter = () => 'foo';
      expect(nullish(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies NullishSchema<StringSchema<undefined>, typeof getter>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = nullish(string());

    test('for wrapper type', () => {
      expectNoSchemaIssue(schema, ['', 'foo', '#$%']);
    });

    test('for undefined', () => {
      expectNoSchemaIssue(schema, [undefined]);
    });

    test('for null', () => {
      expectNoSchemaIssue(schema, [null]);
    });
  });

  describe('should return dataset without default', () => {
    const schema = nullish(string(), 'foo');

    test('for wrapper type', () => {
      expectNoSchemaIssue(schema, ['', 'bar', '#$%']);
    });
  });

  describe('should return dataset with default', () => {
    const schema1 = nullish(string(), null);
    const schema2 = nullish(string(), undefined);
    const schema3 = nullish(string(), 'foo');
    const schema4 = nullish(string(), () => null);
    const schema5 = nullish(string(), () => undefined);
    const schema6 = nullish(string(), () => 'foo');

    test('for undefined', () => {
      expect(schema1['~validate']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: null,
      });
      expect(schema2['~validate']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: undefined,
      });
      expect(schema3['~validate']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: 'foo',
      });
      expect(schema4['~validate']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: null,
      });
      expect(schema5['~validate']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: undefined,
      });
      expect(schema6['~validate']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: 'foo',
      });
    });

    test('for null', () => {
      expect(schema1['~validate']({ value: null }, {})).toStrictEqual({
        typed: true,
        value: null,
      });
      expect(schema2['~validate']({ value: null }, {})).toStrictEqual({
        typed: true,
        value: undefined,
      });
      expect(schema3['~validate']({ value: null }, {})).toStrictEqual({
        typed: true,
        value: 'foo',
      });
      expect(schema4['~validate']({ value: null }, {})).toStrictEqual({
        typed: true,
        value: null,
      });
      expect(schema5['~validate']({ value: null }, {})).toStrictEqual({
        typed: true,
        value: undefined,
      });
      expect(schema6['~validate']({ value: null }, {})).toStrictEqual({
        typed: true,
        value: 'foo',
      });
    });
  });
});

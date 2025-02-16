import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
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
      const expected: NullishSchema<StringSchema<undefined>, undefined> = {
        ...baseSchema,
        default: undefined,
      };
      expect(nullish(string())).toStrictEqual(expected);
      expect(nullish(string(), undefined)).toStrictEqual(expected);
    });

    test('with undefined getter default', () => {
      const getter = () => undefined;
      expect(nullish(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies NullishSchema<StringSchema<undefined>, typeof getter>);
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

  describe('should return dataset with issues', () => {
    const schema = nullish(string('message'));
    const baseIssue: Omit<StringIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'string',
      expected: 'string',
      message: 'message',
    };

    test('for invalid wrapper type', () => {
      expectSchemaIssue(schema, baseIssue, [123, true, {}]);
    });
  });

  describe('should return dataset without default', () => {
    test('for undefined default', () => {
      expectNoSchemaIssue(nullish(string()), [undefined, null, 'foo']);
      expectNoSchemaIssue(nullish(string(), undefined), [
        undefined,
        null,
        'foo',
      ]);
    });

    test('for wrapper type', () => {
      expectNoSchemaIssue(nullish(string(), 'foo'), ['', 'bar', '#$%']);
    });
  });

  describe('should return dataset with default', () => {
    const schema1 = nullish(string(), null);
    const schema2 = nullish(string(), 'foo');
    const schema3 = nullish(string(), () => undefined);
    const schema4 = nullish(string(), () => null);
    const schema5 = nullish(string(), () => 'foo');

    test('for undefined', () => {
      expect(schema1['~run']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: null,
      });
      expect(schema2['~run']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: 'foo',
      });
      expect(schema3['~run']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: undefined,
      });
      expect(schema4['~run']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: null,
      });
      expect(schema5['~run']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: 'foo',
      });
    });

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
        value: undefined,
      });
      expect(schema4['~run']({ value: null }, {})).toStrictEqual({
        typed: true,
        value: null,
      });
      expect(schema5['~run']({ value: null }, {})).toStrictEqual({
        typed: true,
        value: 'foo',
      });
    });
  });
});

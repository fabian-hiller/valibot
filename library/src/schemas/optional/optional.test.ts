import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue } from '../../vitest/index.ts';
import { string, type StringSchema } from '../string/index.ts';
import { optional, type OptionalSchema } from './optional.ts';

describe('optional', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<
      OptionalSchema<StringSchema<undefined>, string>,
      'default'
    > = {
      kind: 'schema',
      type: 'optional',
      reference: optional,
      expects: '(string | undefined)',
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
      const expected: OptionalSchema<StringSchema<undefined>, undefined> = {
        ...baseSchema,
        default: undefined,
      };
      expect(optional(string())).toStrictEqual(expected);
      expect(optional(string(), undefined)).toStrictEqual(expected);
    });

    test('with undefined getter default', () => {
      const getter = () => undefined;
      expect(optional(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies OptionalSchema<StringSchema<undefined>, typeof getter>);
    });

    test('with value default', () => {
      expect(optional(string(), 'foo')).toStrictEqual({
        ...baseSchema,
        default: 'foo',
      } satisfies OptionalSchema<StringSchema<undefined>, 'foo'>);
    });

    test('with value getter default', () => {
      const getter = () => 'foo';
      expect(optional(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies OptionalSchema<StringSchema<undefined>, typeof getter>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = optional(string());

    test('for wrapper type', () => {
      expectNoSchemaIssue(schema, ['', 'foo', '#$%']);
    });

    test('for undefined', () => {
      expectNoSchemaIssue(schema, [undefined]);
    });
  });

  describe('should return dataset without default', () => {
    test('for undefined default', () => {
      expectNoSchemaIssue(optional(string()), [undefined, 'foo']);
      expectNoSchemaIssue(optional(string(), undefined), [undefined, 'foo']);
    });

    test('for wrapper type', () => {
      expectNoSchemaIssue(optional(string(), 'foo'), ['', 'bar', '#$%']);
    });
  });

  describe('should return dataset with default', () => {
    const schema1 = optional(string(), 'foo');
    const schema2 = optional(string(), () => undefined);
    const schema3 = optional(string(), () => 'foo');

    test('for undefined', () => {
      expect(schema1['~run']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: 'foo',
      });
      expect(schema2['~run']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: undefined,
      });
      expect(schema3['~run']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: 'foo',
      });
    });
  });
});

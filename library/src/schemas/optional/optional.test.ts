import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue } from '../../vitest/index.ts';
import { string, type StringSchema } from '../string/index.ts';
import { optional, type OptionalSchema } from './optional.ts';

describe('optional', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<
      OptionalSchema<StringSchema<undefined>, never>,
      'default'
    > = {
      kind: 'schema',
      type: 'optional',
      reference: optional,
      expects: 'string | undefined',
      wrapped: { ...string(), _run: expect.any(Function) },
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined default', () => {
      const schema: OptionalSchema<StringSchema<undefined>, undefined> = {
        ...baseSchema,
        default: undefined,
      };
      expect(optional(string())).toStrictEqual(schema);
      expect(optional(string(), undefined)).toStrictEqual(schema);
      const getter = () => undefined;
      expect(optional(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies OptionalSchema<StringSchema<undefined>, () => undefined>);
    });

    test('with value default', () => {
      expect(optional(string(), 'foo')).toStrictEqual({
        ...baseSchema,
        default: 'foo',
      } satisfies OptionalSchema<StringSchema<undefined>, 'foo'>);
    });

    test('with value getter default', () => {
      const getter = () => 'message';
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
    const schema = optional(string(), 'foo');

    test('for wrapper type', () => {
      expectNoSchemaIssue(schema, ['', 'bar', '#$%']);
    });
  });

  describe('should return dataset with default', () => {
    const schema = optional(string(), 'foo');

    test('for undefined', () => {
      expect(schema._run({ typed: false, value: undefined }, {})).toStrictEqual(
        { typed: true, value: 'foo' }
      );
    });
  });
});

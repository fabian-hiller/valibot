import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue } from '../../vitest/index.ts';
import { string, type StringSchema } from '../string/index.ts';
import { nullable, type NullableSchema } from './nullable.ts';

describe('nullable', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<
      NullableSchema<StringSchema<undefined>, never>,
      'default'
    > = {
      kind: 'schema',
      type: 'nullable',
      reference: nullable,
      expects: 'string | null',
      wrapped: { ...string(), _run: expect.any(Function) },
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined default', () => {
      const schema: NullableSchema<StringSchema<undefined>, undefined> = {
        ...baseSchema,
        default: undefined,
      };
      expect(nullable(string())).toStrictEqual(schema);
      expect(nullable(string(), undefined)).toStrictEqual(schema);
      const getter = () => undefined;
      expect(nullable(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies NullableSchema<StringSchema<undefined>, () => undefined>);
    });

    test('with value default', () => {
      expect(nullable(string(), 'foo')).toStrictEqual({
        ...baseSchema,
        default: 'foo',
      } satisfies NullableSchema<StringSchema<undefined>, 'foo'>);
    });

    test('with value getter default', () => {
      const getter = () => 'message';
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

  describe('should return dataset without default', () => {
    const schema = nullable(string(), 'foo');

    test('for wrapper type', () => {
      expectNoSchemaIssue(schema, ['', 'bar', '#$%']);
    });
  });

  describe('should return dataset with default', () => {
    const schema = nullable(string(), 'foo');

    test('for null', () => {
      expect(schema._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: true,
        value: 'foo',
      });
    });
  });
});

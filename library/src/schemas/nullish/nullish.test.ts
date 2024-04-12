import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue } from '../../vitest/index.ts';
import { string, type StringSchema } from '../string/index.ts';
import { nullish, type NullishSchema } from './nullish.ts';

describe('nullish', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<
      NullishSchema<StringSchema<undefined>, never>,
      'default'
    > = {
      kind: 'schema',
      type: 'nullish',
      expects: 'string | null | undefined',
      wrapped: { ...string(), _run: expect.any(Function) },
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined default', () => {
      const schema: NullishSchema<StringSchema<undefined>, undefined> = {
        ...baseSchema,
        default: undefined,
      };
      expect(nullish(string())).toStrictEqual(schema);
      expect(nullish(string(), undefined)).toStrictEqual(schema);
      const getter = () => undefined;
      expect(nullish(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies NullishSchema<StringSchema<undefined>, () => undefined>);
    });

    test('with value default', () => {
      expect(nullish(string(), 'foo')).toStrictEqual({
        ...baseSchema,
        default: 'foo',
      } satisfies NullishSchema<StringSchema<undefined>, 'foo'>);
    });

    test('with value getter default', () => {
      const getter = () => 'message';
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
    const schema = nullish(string(), 'foo');

    test('for undefined', () => {
      expect(schema._run({ typed: false, value: undefined }, {})).toStrictEqual(
        { typed: true, value: 'foo' }
      );
    });

    test('for null', () => {
      expect(schema._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: true,
        value: 'foo',
      });
    });
  });
});

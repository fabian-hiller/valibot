import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue } from '../../vitest/index.ts';
import { string, type StringSchema } from '../string/index.ts';
import { undefinedable, type UndefinedableSchema } from './undefinedable.ts';

describe('undefinedable', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<
      UndefinedableSchema<StringSchema<undefined>, string>,
      'default'
    > = {
      kind: 'schema',
      type: 'undefinedable',
      reference: undefinedable,
      expects: '(string | undefined)',
      wrapped: {
        ...string(),
        '~validate': expect.any(Function),
      },
      async: false,
      '~standard': 1,
      '~vendor': 'valibot',
      '~validate': expect.any(Function),
    };

    test('with undefined default', () => {
      const expected: UndefinedableSchema<
        StringSchema<undefined>,
        undefined
      > = {
        ...baseSchema,
        default: undefined,
      };
      expect(undefinedable(string())).toStrictEqual(expected);
      expect(undefinedable(string(), undefined)).toStrictEqual(expected);
    });

    test('with undefined getter default', () => {
      const getter = () => undefined;
      expect(undefinedable(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies UndefinedableSchema<StringSchema<undefined>, typeof getter>);
    });

    test('with value default', () => {
      expect(undefinedable(string(), 'foo')).toStrictEqual({
        ...baseSchema,
        default: 'foo',
      } satisfies UndefinedableSchema<StringSchema<undefined>, 'foo'>);
    });

    test('with value getter default', () => {
      const getter = () => 'foo';
      expect(undefinedable(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies UndefinedableSchema<StringSchema<undefined>, typeof getter>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = undefinedable(string());

    test('for wrapper type', () => {
      expectNoSchemaIssue(schema, ['', 'foo', '#$%']);
    });

    test('for undefined', () => {
      expectNoSchemaIssue(schema, [undefined]);
    });
  });

  describe('should return dataset without default', () => {
    test('for undefined default', () => {
      expectNoSchemaIssue(undefinedable(string()), [undefined, 'foo']);
      expectNoSchemaIssue(undefinedable(string(), undefined), [
        undefined,
        'foo',
      ]);
    });

    test('for wrapper type', () => {
      expectNoSchemaIssue(undefinedable(string(), 'foo'), ['', 'bar', '#$%']);
    });
  });

  describe('should return dataset with default', () => {
    const schema1 = undefinedable(string(), 'foo');
    const schema2 = undefinedable(string(), () => undefined);
    const schema3 = undefinedable(string(), () => 'foo');

    test('for undefined', () => {
      expect(schema1['~validate']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: 'foo',
      });
      expect(schema2['~validate']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: undefined,
      });
      expect(schema3['~validate']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: 'foo',
      });
    });
  });
});

import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssueAsync } from '../../vitest/index.ts';
import { string, type StringSchema } from '../string/index.ts';
import { optionalAsync, type OptionalSchemaAsync } from './optionalAsync.ts';

describe('optionalAsync', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<
      OptionalSchemaAsync<StringSchema<undefined>, string>,
      'default'
    > = {
      kind: 'schema',
      type: 'optional',
      reference: optionalAsync,
      expects: '(string | undefined)',
      wrapped: {
        ...string(),
        '~validate': expect.any(Function),
      },
      async: true,
      '~standard': 1,
      '~vendor': 'valibot',
      '~validate': expect.any(Function),
    };

    test('with never default', () => {
      expect(optionalAsync(string())).toStrictEqual(baseSchema);
    });

    test('with undefined default', () => {
      expect(optionalAsync(string(), undefined)).toStrictEqual({
        ...baseSchema,
        default: undefined,
      } satisfies OptionalSchemaAsync<StringSchema<undefined>, undefined>);
    });

    test('with undefined getter default', () => {
      const getter = () => undefined;
      expect(optionalAsync(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies OptionalSchemaAsync<StringSchema<undefined>, typeof getter>);
    });

    test('with async undefined getter default', () => {
      const getter = async () => undefined;
      expect(optionalAsync(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies OptionalSchemaAsync<StringSchema<undefined>, typeof getter>);
    });

    test('with value default', () => {
      expect(optionalAsync(string(), 'foo')).toStrictEqual({
        ...baseSchema,
        default: 'foo',
      } satisfies OptionalSchemaAsync<StringSchema<undefined>, 'foo'>);
    });

    test('with value getter default', () => {
      const getter = () => 'foo';
      expect(optionalAsync(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies OptionalSchemaAsync<StringSchema<undefined>, typeof getter>);
    });

    test('with async value getter default', () => {
      const getter = async () => 'foo';
      expect(optionalAsync(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies OptionalSchemaAsync<StringSchema<undefined>, typeof getter>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = optionalAsync(string());

    test('for wrapper type', async () => {
      await expectNoSchemaIssueAsync(schema, ['', 'foo', '#$%']);
    });

    test('for undefined', async () => {
      await expectNoSchemaIssueAsync(schema, [undefined]);
    });
  });

  describe('should return dataset without default', () => {
    const schema = optionalAsync(string(), 'foo');

    test('for wrapper type', async () => {
      await expectNoSchemaIssueAsync(schema, ['', 'bar', '#$%']);
    });
  });

  describe('should return dataset with default', () => {
    const schema1 = optionalAsync(string(), undefined);
    const schema2 = optionalAsync(string(), 'foo');
    const schema3 = optionalAsync(string(), () => undefined);
    const schema4 = optionalAsync(string(), () => 'foo');
    const schema5 = optionalAsync(string(), async () => undefined);
    const schema6 = optionalAsync(string(), async () => 'foo');

    test('for undefined', async () => {
      expect(
        await schema1['~validate']({ value: undefined }, {})
      ).toStrictEqual({
        typed: true,
        value: undefined,
      });
      expect(
        await schema2['~validate']({ value: undefined }, {})
      ).toStrictEqual({
        typed: true,
        value: 'foo',
      });
      expect(
        await schema3['~validate']({ value: undefined }, {})
      ).toStrictEqual({
        typed: true,
        value: undefined,
      });
      expect(
        await schema4['~validate']({ value: undefined }, {})
      ).toStrictEqual({
        typed: true,
        value: 'foo',
      });
      expect(
        await schema5['~validate']({ value: undefined }, {})
      ).toStrictEqual({
        typed: true,
        value: undefined,
      });
      expect(
        await schema6['~validate']({ value: undefined }, {})
      ).toStrictEqual({
        typed: true,
        value: 'foo',
      });
    });
  });
});

import { describe, expect, test } from 'vitest';
import {
  expectNoSchemaIssueAsync,
  expectSchemaIssueAsync,
} from '../../vitest/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import { nullishAsync, type NullishSchemaAsync } from './nullishAsync.ts';

describe('nullishAsync', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<
      NullishSchemaAsync<StringSchema<undefined>, string>,
      'default'
    > = {
      kind: 'schema',
      type: 'nullish',
      reference: nullishAsync,
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
      async: true,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    test('with undefined default', () => {
      const expected: NullishSchemaAsync<StringSchema<undefined>, undefined> = {
        ...baseSchema,
        default: undefined,
      };
      expect(nullishAsync(string())).toStrictEqual(expected);
      expect(nullishAsync(string(), undefined)).toStrictEqual(expected);
    });

    test('with undefined getter default', () => {
      const getter = () => undefined;
      expect(nullishAsync(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies NullishSchemaAsync<StringSchema<undefined>, typeof getter>);
    });

    test('with async undefined getter default', () => {
      const getter = async () => undefined;
      expect(nullishAsync(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies NullishSchemaAsync<StringSchema<undefined>, typeof getter>);
    });

    test('with null default', () => {
      expect(nullishAsync(string(), null)).toStrictEqual({
        ...baseSchema,
        default: null,
      } satisfies NullishSchemaAsync<StringSchema<undefined>, null>);
    });

    test('with null getter default', () => {
      const getter = () => null;
      expect(nullishAsync(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies NullishSchemaAsync<StringSchema<undefined>, typeof getter>);
    });

    test('with async null getter default', () => {
      const getter = async () => null;
      expect(nullishAsync(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies NullishSchemaAsync<StringSchema<undefined>, typeof getter>);
    });

    test('with value default', () => {
      expect(nullishAsync(string(), 'foo')).toStrictEqual({
        ...baseSchema,
        default: 'foo',
      } satisfies NullishSchemaAsync<StringSchema<undefined>, 'foo'>);
    });

    test('with value getter default', () => {
      const getter = () => 'foo';
      expect(nullishAsync(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies NullishSchemaAsync<StringSchema<undefined>, typeof getter>);
    });

    test('with async value getter default', () => {
      const getter = async () => 'foo';
      expect(nullishAsync(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies NullishSchemaAsync<StringSchema<undefined>, typeof getter>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = nullishAsync(string());

    test('for wrapper type', async () => {
      await expectNoSchemaIssueAsync(schema, ['', 'foo', '#$%']);
    });

    test('for undefined', async () => {
      await expectNoSchemaIssueAsync(schema, [undefined]);
    });

    test('for null', async () => {
      await expectNoSchemaIssueAsync(schema, [null]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = nullishAsync(string('message'));
    const baseIssue: Omit<StringIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'string',
      expected: 'string',
      message: 'message',
    };

    test('for invalid wrapper type', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [123, true, {}]);
    });
  });

  describe('should return dataset without default', () => {
    test('for undefined default', async () => {
      await expectNoSchemaIssueAsync(nullishAsync(string()), [
        undefined,
        null,
        'foo',
      ]);
      await expectNoSchemaIssueAsync(nullishAsync(string(), undefined), [
        undefined,
        null,
        'foo',
      ]);
    });

    test('for wrapper type', async () => {
      await expectNoSchemaIssueAsync(nullishAsync(string(), 'foo'), [
        '',
        'bar',
        '#$%',
      ]);
    });
  });

  describe('should return dataset with default', () => {
    const schema1 = nullishAsync(string(), null);
    const schema3 = nullishAsync(string(), 'foo');
    const schema4 = nullishAsync(string(), () => undefined);
    const schema5 = nullishAsync(string(), () => null);
    const schema6 = nullishAsync(string(), () => 'foo');
    const schema7 = nullishAsync(string(), async () => undefined);
    const schema8 = nullishAsync(string(), async () => null);
    const schema9 = nullishAsync(string(), async () => 'foo');

    test('for undefined', async () => {
      expect(await schema1['~run']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: null,
      });
      expect(await schema3['~run']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: 'foo',
      });
      expect(await schema4['~run']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: undefined,
      });
      expect(await schema5['~run']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: null,
      });
      expect(await schema6['~run']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: 'foo',
      });
      expect(await schema7['~run']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: undefined,
      });
      expect(await schema8['~run']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: null,
      });
      expect(await schema9['~run']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: 'foo',
      });
    });

    test('for null', async () => {
      expect(await schema1['~run']({ value: null }, {})).toStrictEqual({
        typed: true,
        value: null,
      });
      expect(await schema3['~run']({ value: null }, {})).toStrictEqual({
        typed: true,
        value: 'foo',
      });
      expect(await schema4['~run']({ value: null }, {})).toStrictEqual({
        typed: true,
        value: undefined,
      });
      expect(await schema5['~run']({ value: null }, {})).toStrictEqual({
        typed: true,
        value: null,
      });
      expect(await schema6['~run']({ value: null }, {})).toStrictEqual({
        typed: true,
        value: 'foo',
      });
      expect(await schema7['~run']({ value: null }, {})).toStrictEqual({
        typed: true,
        value: undefined,
      });
      expect(await schema8['~run']({ value: null }, {})).toStrictEqual({
        typed: true,
        value: null,
      });
      expect(await schema9['~run']({ value: null }, {})).toStrictEqual({
        typed: true,
        value: 'foo',
      });
    });
  });
});

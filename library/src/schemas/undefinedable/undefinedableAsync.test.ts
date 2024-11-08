import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssueAsync } from '../../vitest/index.ts';
import { string, type StringSchema } from '../string/index.ts';
import {
  undefinedableAsync,
  type UndefinedableSchemaAsync,
} from './undefinedableAsync.ts';

describe('undefinedableAsync', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<
      UndefinedableSchemaAsync<StringSchema<undefined>, string>,
      'default'
    > = {
      kind: 'schema',
      type: 'undefinedable',
      reference: undefinedableAsync,
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
      async: true,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    test('with undefined default', () => {
      const expected: UndefinedableSchemaAsync<
        StringSchema<undefined>,
        undefined
      > = {
        ...baseSchema,
        default: undefined,
      };
      expect(undefinedableAsync(string())).toStrictEqual(expected);
      expect(undefinedableAsync(string(), undefined)).toStrictEqual(expected);
    });

    test('with undefined getter default', () => {
      const getter = () => undefined;
      expect(undefinedableAsync(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies UndefinedableSchemaAsync<
        StringSchema<undefined>,
        typeof getter
      >);
    });

    test('with async undefined getter default', () => {
      const getter = async () => undefined;
      expect(undefinedableAsync(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies UndefinedableSchemaAsync<
        StringSchema<undefined>,
        typeof getter
      >);
    });

    test('with value default', () => {
      expect(undefinedableAsync(string(), 'foo')).toStrictEqual({
        ...baseSchema,
        default: 'foo',
      } satisfies UndefinedableSchemaAsync<StringSchema<undefined>, 'foo'>);
    });

    test('with value getter default', () => {
      const getter = () => 'foo';
      expect(undefinedableAsync(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies UndefinedableSchemaAsync<
        StringSchema<undefined>,
        typeof getter
      >);
    });

    test('with async value getter default', () => {
      const getter = async () => 'foo';
      expect(undefinedableAsync(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies UndefinedableSchemaAsync<
        StringSchema<undefined>,
        typeof getter
      >);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = undefinedableAsync(string());

    test('for wrapper type', async () => {
      await expectNoSchemaIssueAsync(schema, ['', 'foo', '#$%']);
    });

    test('for undefined', async () => {
      await expectNoSchemaIssueAsync(schema, [undefined]);
    });
  });

  describe('should return dataset without default', () => {
    test('for undefined default', async () => {
      await expectNoSchemaIssueAsync(undefinedableAsync(string()), [
        undefined,
        'foo',
      ]);
      await expectNoSchemaIssueAsync(undefinedableAsync(string(), undefined), [
        undefined,
        'foo',
      ]);
    });

    test('for wrapper type', async () => {
      await expectNoSchemaIssueAsync(undefinedableAsync(string(), 'foo'), [
        '',
        'bar',
        '#$%',
      ]);
    });
  });

  describe('should return dataset with default', () => {
    const schema1 = undefinedableAsync(string(), 'foo');
    const schema2 = undefinedableAsync(string(), () => undefined);
    const schema3 = undefinedableAsync(string(), () => 'foo');
    const schema4 = undefinedableAsync(string(), async () => undefined);
    const schema5 = undefinedableAsync(string(), async () => 'foo');

    test('for undefined', async () => {
      expect(await schema1['~run']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: 'foo',
      });
      expect(await schema2['~run']({ value: undefined }, {})).toStrictEqual({
        typed: true,
        value: undefined,
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
        value: 'foo',
      });
    });
  });
});

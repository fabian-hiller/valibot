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
import {
  exactOptionalAsync,
  type ExactOptionalSchemaAsync,
} from './exactOptionalAsync.ts';

describe('exactOptionalAsync', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<
      ExactOptionalSchemaAsync<StringSchema<undefined>, string>,
      'default'
    > = {
      kind: 'schema',
      type: 'exact_optional',
      reference: exactOptionalAsync,
      expects: 'string',
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
      const expected: ExactOptionalSchemaAsync<
        StringSchema<undefined>,
        undefined
      > = {
        ...baseSchema,
        default: undefined,
      };
      expect(exactOptionalAsync(string())).toStrictEqual(expected);
      expect(exactOptionalAsync(string(), undefined)).toStrictEqual(expected);
    });

    test('with value default', () => {
      expect(exactOptionalAsync(string(), 'foo')).toStrictEqual({
        ...baseSchema,
        default: 'foo',
      } satisfies ExactOptionalSchemaAsync<StringSchema<undefined>, 'foo'>);
    });

    test('with value getter default', () => {
      const getter = () => 'foo';
      expect(exactOptionalAsync(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies ExactOptionalSchemaAsync<
        StringSchema<undefined>,
        typeof getter
      >);
    });

    test('with async value getter default', () => {
      const getter = async () => 'foo';
      expect(exactOptionalAsync(string(), getter)).toStrictEqual({
        ...baseSchema,
        default: getter,
      } satisfies ExactOptionalSchemaAsync<
        StringSchema<undefined>,
        typeof getter
      >);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = exactOptionalAsync(string());

    test('for wrapper type', async () => {
      await expectNoSchemaIssueAsync(schema, ['', 'foo', '#$%']);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = exactOptionalAsync(string('message'));
    const baseIssue: Omit<StringIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'string',
      expected: 'string',
      message: 'message',
    };

    test('for invalid wrapper type', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [123, true, {}]);
    });

    test('for null', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [null]);
    });

    test('for undefined', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [undefined]);
    });
  });

  describe('should return dataset without default', () => {
    test('for undefined default', async () => {
      await expectNoSchemaIssueAsync(exactOptionalAsync(string()), ['foo']);
      await expectNoSchemaIssueAsync(exactOptionalAsync(string(), undefined), [
        'foo',
      ]);
    });

    test('for wrapper type', async () => {
      await expectNoSchemaIssueAsync(exactOptionalAsync(string(), 'foo'), [
        '',
        'bar',
        '#$%',
      ]);
    });
  });
});

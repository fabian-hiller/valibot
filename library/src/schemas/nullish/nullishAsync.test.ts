import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssueAsync } from '../../vitest/index.ts';
import { string, type StringSchema } from '../string/index.ts';
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
      expects: 'string | null | undefined',
      wrapped: { ...string(), _run: expect.any(Function) },
      async: true,
      _run: expect.any(Function),
    };

    test('with never default', () => {
      expect(nullishAsync(string())).toStrictEqual(baseSchema);
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

    test('with undefined default', () => {
      expect(nullishAsync(string(), undefined)).toStrictEqual({
        ...baseSchema,
        default: undefined,
      } satisfies NullishSchemaAsync<StringSchema<undefined>, undefined>);
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

  describe('should return dataset without default', () => {
    const schema = nullishAsync(string(), 'foo');

    test('for wrapper type', async () => {
      await expectNoSchemaIssueAsync(schema, ['', 'bar', '#$%']);
    });
  });

  describe('should return dataset with default', () => {
    const schema1 = nullishAsync(string(), null);
    const schema2 = nullishAsync(string(), undefined);
    const schema3 = nullishAsync(string(), 'foo');
    const schema4 = nullishAsync(string(), () => null);
    const schema5 = nullishAsync(string(), () => undefined);
    const schema6 = nullishAsync(string(), () => 'foo');
    const schema7 = nullishAsync(string(), async () => null);
    const schema8 = nullishAsync(string(), async () => undefined);
    const schema9 = nullishAsync(string(), async () => 'foo');

    test('for undefined', async () => {
      expect(
        await schema1._run({ typed: false, value: undefined }, {})
      ).toStrictEqual({ typed: true, value: null });
      expect(
        await schema2._run({ typed: false, value: undefined }, {})
      ).toStrictEqual({ typed: true, value: undefined });
      expect(
        await schema3._run({ typed: false, value: undefined }, {})
      ).toStrictEqual({ typed: true, value: 'foo' });
      expect(
        await schema4._run({ typed: false, value: undefined }, {})
      ).toStrictEqual({ typed: true, value: null });
      expect(
        await schema5._run({ typed: false, value: undefined }, {})
      ).toStrictEqual({ typed: true, value: undefined });
      expect(
        await schema6._run({ typed: false, value: undefined }, {})
      ).toStrictEqual({ typed: true, value: 'foo' });
      expect(
        await schema7._run({ typed: false, value: undefined }, {})
      ).toStrictEqual({ typed: true, value: null });
      expect(
        await schema8._run({ typed: false, value: undefined }, {})
      ).toStrictEqual({ typed: true, value: undefined });
      expect(
        await schema9._run({ typed: false, value: undefined }, {})
      ).toStrictEqual({ typed: true, value: 'foo' });
    });

    test('for null', async () => {
      expect(
        await schema1._run({ typed: false, value: null }, {})
      ).toStrictEqual({
        typed: true,
        value: null,
      });
      expect(
        await schema2._run({ typed: false, value: null }, {})
      ).toStrictEqual({
        typed: true,
        value: undefined,
      });
      expect(
        await schema3._run({ typed: false, value: null }, {})
      ).toStrictEqual({
        typed: true,
        value: 'foo',
      });
      expect(
        await schema4._run({ typed: false, value: null }, {})
      ).toStrictEqual({
        typed: true,
        value: null,
      });
      expect(
        await schema5._run({ typed: false, value: null }, {})
      ).toStrictEqual({
        typed: true,
        value: undefined,
      });
      expect(
        await schema6._run({ typed: false, value: null }, {})
      ).toStrictEqual({
        typed: true,
        value: 'foo',
      });
      expect(
        await schema7._run({ typed: false, value: null }, {})
      ).toStrictEqual({
        typed: true,
        value: null,
      });
      expect(
        await schema8._run({ typed: false, value: null }, {})
      ).toStrictEqual({
        typed: true,
        value: undefined,
      });
      expect(
        await schema9._run({ typed: false, value: null }, {})
      ).toStrictEqual({
        typed: true,
        value: 'foo',
      });
    });
  });
});

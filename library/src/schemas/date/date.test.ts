import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import { date, type DateIssue, type DateSchema } from './date.ts';

describe('date', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<DateSchema<never>, 'message'> = {
      kind: 'schema',
      type: 'date',
      reference: date,
      expects: 'Date',
      async: false,
      '~standard': 1,
      '~vendor': 'valibot',
      '~validate': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: DateSchema<undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(date()).toStrictEqual(schema);
      expect(date(undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(date('message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies DateSchema<'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(date(message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies DateSchema<typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = date();

    test('for current date', () => {
      expectNoSchemaIssue(schema, [new Date()]);
    });

    test('for past date', () => {
      expectNoSchemaIssue(schema, [new Date(0)]);
    });

    test('for future date', () => {
      expectNoSchemaIssue(schema, [new Date(8640000000000000)]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = date('message');
    const baseIssue: Omit<DateIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'date',
      expected: 'Date',
      message: 'message',
    };

    // Special values

    test('for invalid dates', () => {
      expectSchemaIssue(schema, baseIssue, [new Date('foo')], '"Invalid Date"');
    });

    // Primitive types

    test('for bigints', () => {
      expectSchemaIssue(schema, baseIssue, [-1n, 0n, 123n]);
    });

    test('for booleans', () => {
      expectSchemaIssue(schema, baseIssue, [true, false]);
    });

    test('for null', () => {
      expectSchemaIssue(schema, baseIssue, [null]);
    });

    test('for numbers', () => {
      expectSchemaIssue(schema, baseIssue, [-1, 0, 123, 45.67]);
    });

    test('for undefined', () => {
      expectSchemaIssue(schema, baseIssue, [undefined]);
    });

    test('for strings', () => {
      expectSchemaIssue(schema, baseIssue, ['', 'foo', '123']);
    });

    test('for symbols', () => {
      expectSchemaIssue(schema, baseIssue, [Symbol(), Symbol('foo')]);
    });

    // Complex types

    test('for arrays', () => {
      expectSchemaIssue(schema, baseIssue, [[], ['value']]);
    });

    test('for functions', () => {
      expectSchemaIssue(schema, baseIssue, [() => {}, function () {}]);
    });

    test('for objects', () => {
      expectSchemaIssue(schema, baseIssue, [{}, { key: 'value' }]);
    });
  });
});

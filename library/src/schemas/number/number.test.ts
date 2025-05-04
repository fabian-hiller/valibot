import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import { number, type NumberIssue, type NumberSchema } from './number.ts';

describe('number', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<NumberSchema<never>, 'message'> = {
      kind: 'schema',
      type: 'number',
      reference: number,
      expects: 'number',
      async: false,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: NumberSchema<undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(number()).toStrictEqual(schema);
      expect(number(undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(number('message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies NumberSchema<'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(number(message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies NumberSchema<typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = number();

    test('for number zero', () => {
      expectNoSchemaIssue(schema, [0, -0, 0.0, -0.0]);
    });

    test('for positive integers', () => {
      expectNoSchemaIssue(schema, [1, 23, 456, Number.MAX_VALUE]);
    });

    test('for negative integers', () => {
      expectNoSchemaIssue(schema, [-1, -23, -456, Number.MIN_VALUE]);
    });

    test('for positive floats', () => {
      expectNoSchemaIssue(schema, [0.1, 23.456, 1 / 3]);
    });

    test('for negative floats', () => {
      expectNoSchemaIssue(schema, [-0.1, -23.456, -1 / 3]);
    });

    test('for infinity numbers', () => {
      expectNoSchemaIssue(schema, [Infinity, -Infinity]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = number('message');
    const baseIssue: Omit<NumberIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'number',
      expected: 'number',
      message: 'message',
    };

    // Special values

    test('for NaN', () => {
      expectSchemaIssue(schema, baseIssue, [NaN]);
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

    test('for undefined', () => {
      expectSchemaIssue(schema, baseIssue, [undefined]);
    });

    test('for strings', () => {
      expectSchemaIssue(schema, baseIssue, ['', '0', '-2', '12.34']);
    });

    test('for symbols', () => {
      expectSchemaIssue(schema, baseIssue, [Symbol(), Symbol('foo')]);
    });

    // Complex types

    test('for arrays', () => {
      expectSchemaIssue(schema, baseIssue, [[], ['value']]);
    });

    test('for functions', () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      expectSchemaIssue(schema, baseIssue, [() => {}, function () {}]);
    });

    test('for objects', () => {
      expectSchemaIssue(schema, baseIssue, [{}, { key: 'value' }]);
    });
  });
});

import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import { bigint, type BigintIssue, type BigintSchema } from './bigint.ts';

describe('bigint', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<BigintSchema<never>, 'message'> = {
      kind: 'schema',
      type: 'bigint',
      reference: bigint,
      expects: 'bigint',
      async: false,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: BigintSchema<undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(bigint()).toStrictEqual(schema);
      expect(bigint(undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(bigint('message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies BigintSchema<'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(bigint(message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies BigintSchema<typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = bigint();

    test('for bigint zero', () => {
      expectNoSchemaIssue(schema, [0n, -0n]);
    });

    test('for positive bigints', () => {
      expectNoSchemaIssue(schema, [1n, 23n, 456n]);
    });

    test('for negative bigints', () => {
      expectNoSchemaIssue(schema, [-1n, -23n, -456n]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = bigint('message');
    const baseIssue: Omit<BigintIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'bigint',
      expected: 'bigint',
      message: 'message',
    };

    // Primitive types

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

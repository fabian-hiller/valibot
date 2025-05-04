import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import { boolean, type BooleanIssue, type BooleanSchema } from './boolean.ts';

describe('boolean', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<BooleanSchema<never>, 'message'> = {
      kind: 'schema',
      type: 'boolean',
      reference: boolean,
      expects: 'boolean',
      async: false,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: BooleanSchema<undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(boolean()).toStrictEqual(schema);
      expect(boolean(undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(boolean('message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies BooleanSchema<'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(boolean(message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies BooleanSchema<typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = boolean();

    test('for true boolean', () => {
      expectNoSchemaIssue(schema, [true]);
    });

    test('for false boolean', () => {
      expectNoSchemaIssue(schema, [false]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = boolean('message');
    const baseIssue: Omit<BooleanIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'boolean',
      expected: 'boolean',
      message: 'message',
    };

    // Primitive types

    test('for bigints', () => {
      expectSchemaIssue(schema, baseIssue, [-1n, 0n, 123n]);
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
      expectSchemaIssue(schema, baseIssue, ['', '0', 'true', 'false']);
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

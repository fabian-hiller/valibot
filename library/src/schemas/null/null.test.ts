import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import { null_, type NullIssue, type NullSchema } from './null.ts';

describe('null', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<NullSchema<never>, 'message'> = {
      kind: 'schema',
      type: 'null',
      reference: null_,
      expects: 'null',
      async: false,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: NullSchema<undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(null_()).toStrictEqual(schema);
      expect(null_(undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(null_('message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies NullSchema<'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(null_(message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies NullSchema<typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = null_();

    test('for null', () => {
      expectNoSchemaIssue(schema, [null]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = null_('message');
    const baseIssue: Omit<NullIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'null',
      expected: 'null',
      message: 'message',
    };

    // Primitive types

    test('for bigints', () => {
      expectSchemaIssue(schema, baseIssue, [-1n, 0n, 123n]);
    });

    test('for booleans', () => {
      expectSchemaIssue(schema, baseIssue, [true, false]);
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
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      expectSchemaIssue(schema, baseIssue, [() => {}, function () {}]);
    });

    test('for objects', () => {
      expectSchemaIssue(schema, baseIssue, [{}, { key: 'value' }]);
    });
  });
});

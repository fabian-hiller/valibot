import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import { void_, type VoidIssue, type VoidSchema } from './void.ts';

describe('void', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<VoidSchema<never>, 'message'> = {
      kind: 'schema',
      type: 'void',
      reference: void_,
      expects: 'void',
      async: false,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: VoidSchema<undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(void_()).toStrictEqual(schema);
      expect(void_(undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(void_('message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies VoidSchema<'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(void_(message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies VoidSchema<typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = void_();

    test('for undefined', () => {
      expectNoSchemaIssue(schema, [undefined]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = void_('message');
    const baseIssue: Omit<VoidIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'void',
      expected: 'void',
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

    test('for null', () => {
      expectSchemaIssue(schema, baseIssue, [null]);
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

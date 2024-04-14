import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import {
  undefined_,
  type UndefinedIssue,
  type UndefinedSchema,
} from './undefined.ts';

describe('undefined', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<UndefinedSchema<never>, 'message'> = {
      kind: 'schema',
      type: 'undefined',
      expects: 'undefined',
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: UndefinedSchema<undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(undefined_()).toStrictEqual(schema);
      expect(undefined_(undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(undefined_('message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies UndefinedSchema<'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(undefined_(message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies UndefinedSchema<typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = undefined_();

    test('for undefined', () => {
      expectNoSchemaIssue(schema, [undefined]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = undefined_('message');
    const baseIssue: Omit<UndefinedIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'undefined',
      expected: 'undefined',
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

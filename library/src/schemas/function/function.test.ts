import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import {
  function_,
  type FunctionIssue,
  type FunctionSchema,
} from './function.ts';

describe('function', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<FunctionSchema<never>, 'message'> = {
      kind: 'schema',
      type: 'function',
      reference: function_,
      expects: 'Function',
      async: false,
      '~standard': 1,
      '~vendor': 'valibot',
      '~validate': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: FunctionSchema<undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(function_()).toStrictEqual(schema);
      expect(function_(undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(function_('message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies FunctionSchema<'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(function_(message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies FunctionSchema<typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = function_();

    test('for functions', () => {
      expectNoSchemaIssue(schema, [() => {}, function () {}]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = function_('message');
    const baseIssue: Omit<FunctionIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'function',
      expected: 'Function',
      message: 'message',
    };

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

    test('for objects', () => {
      expectSchemaIssue(schema, baseIssue, [{}, { key: 'value' }]);
    });
  });
});

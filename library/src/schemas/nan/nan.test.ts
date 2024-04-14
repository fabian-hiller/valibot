import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import { nan, type NanIssue, type NanSchema } from './nan.ts';

describe('nan', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<NanSchema<never>, 'message'> = {
      kind: 'schema',
      type: 'nan',
      expects: 'NaN',
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: NanSchema<undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(nan()).toStrictEqual(schema);
      expect(nan(undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(nan('message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies NanSchema<'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(nan(message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies NanSchema<typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = nan();

    test('for NaN', () => {
      expectNoSchemaIssue(schema, [NaN, Number.NaN]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = nan('message');
    const baseIssue: Omit<NanIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'nan',
      expected: 'NaN',
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

    test('for functions', () => {
      expectSchemaIssue(schema, baseIssue, [() => {}, function () {}]);
    });

    test('for objects', () => {
      expectSchemaIssue(schema, baseIssue, [{}, { key: 'value' }]);
    });
  });
});

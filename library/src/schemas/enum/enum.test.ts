import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import { enum_, type EnumIssue, type EnumSchema } from './enum.ts';

describe('enum_', () => {
  enum options {
    option1 = 'foo',
    option2 = 'bar',
    option3 = 'baz',
  }
  type Options = typeof options;

  describe('should return schema object', () => {
    const baseSchema: Omit<EnumSchema<Options, never>, 'message'> = {
      kind: 'schema',
      type: 'enum',
      reference: enum_,
      expects: '"foo" | "bar" | "baz"',
      enum: options,
      // @ts-expect-error
      options: Object.entries(options)
        .filter(([key]) => isNaN(+key))
        .map(([, value]) => value),
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: EnumSchema<Options, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(enum_(options)).toStrictEqual(schema);
      expect(enum_(options, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(enum_(options, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies EnumSchema<Options, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(enum_(options, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies EnumSchema<Options, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    test('for valid options', () => {
      expectNoSchemaIssue(enum_(options), [
        options.option1,
        options.option2,
        options.option3,
      ]);
    });

    test('for valid values', () => {
      // @ts-expect-error
      expectNoSchemaIssue(enum_(options), ['foo', 'bar', 'baz']);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = enum_(options, 'message');
    const baseIssue: Omit<EnumIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'enum',
      expected: '"foo" | "bar" | "baz"',
      message: 'message',
    };

    // Special values

    test('for empty options', () => {
      enum Empty {}
      expectSchemaIssue(
        enum_(Empty, 'message'),
        { ...baseIssue, expected: 'never' },
        ['foo', 'bar', 'baz']
      );
    });

    test('for invalid options', () => {
      expectSchemaIssue(schema, baseIssue, ['fo', 'fooo', 'foobar']);
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
      expectSchemaIssue(schema, baseIssue, ['', 'hello', '123']);
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

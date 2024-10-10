import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import { promise, type PromiseIssue, type PromiseSchema } from './promise.ts';

describe('promise', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<PromiseSchema<never>, 'message'> = {
      kind: 'schema',
      type: 'promise',
      reference: promise,
      expects: 'Promise',
      async: false,
      '~standard': 1,
      '~vendor': 'valibot',
      '~validate': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: PromiseSchema<undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(promise()).toStrictEqual(schema);
      expect(promise(undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(promise('message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies PromiseSchema<'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(promise(message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies PromiseSchema<typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = promise();

    test('for Promise objects', () => {
      expectNoSchemaIssue(schema, [
        Promise.resolve(),
        Promise.resolve('foo'),
        Promise.all([]),
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = promise('message');
    const baseIssue: Omit<PromiseIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'promise',
      expected: 'Promise',
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

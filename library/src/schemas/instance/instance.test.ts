import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import {
  instance,
  type InstanceIssue,
  type InstanceSchema,
} from './instance.ts';

describe('instance', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<
      InstanceSchema<DateConstructor, never>,
      'message'
    > = {
      kind: 'schema',
      type: 'instance',
      reference: instance,
      expects: 'Date',
      class: Date,
      async: false,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: InstanceSchema<DateConstructor, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(instance(Date)).toStrictEqual(schema);
      expect(instance(Date, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(instance(Date, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies InstanceSchema<DateConstructor, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(instance(Date, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies InstanceSchema<DateConstructor, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = instance(Date);

    test('for valid instances', () => {
      expectNoSchemaIssue(schema, [new Date(), new Date(123456789)]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = instance(Date, 'message');
    const baseIssue: Omit<InstanceIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'instance',
      expected: 'Date',
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

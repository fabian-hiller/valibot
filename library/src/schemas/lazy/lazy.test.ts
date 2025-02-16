import { describe, expect, test, vi } from 'vitest';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import { lazy, type LazySchema } from './lazy.ts';

describe('lazy', () => {
  test('should return schema object', () => {
    const getter = () => string();
    expect(lazy(getter)).toStrictEqual({
      kind: 'schema',
      type: 'lazy',
      reference: lazy,
      expects: 'unknown',
      getter,
      async: false,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    } satisfies LazySchema<StringSchema<undefined>>);
  });

  describe('should return dataset without issues', () => {
    const schema = lazy(() => string());

    test('for strings', () => {
      expectNoSchemaIssue(schema, ['', 'foo', '123']);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = lazy(() => string('message'));
    const baseIssue: Omit<StringIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'string',
      expected: 'string',
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

  test('should call getter with input', () => {
    const getter = vi.fn(() => string());
    const dataset = { value: 'foo' };
    lazy(getter)['~run'](dataset, {});
    expect(getter).toHaveBeenCalledWith(dataset.value);
  });
});

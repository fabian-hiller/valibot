import { describe, expect, test } from 'vitest';
import type { InferIssue, UntypedDataset } from '../../types/index.ts';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import { string, type StringIssue } from '../string/index.ts';
import { set, type SetSchema } from './set.ts';
import type { SetIssue } from './types.ts';

describe('set', () => {
  describe('should return schema set', () => {
    const value = string();
    type Value = typeof value;
    const baseSchema: Omit<SetSchema<Value, never>, 'message'> = {
      kind: 'schema',
      type: 'set',
      reference: set,
      expects: 'Set',
      value,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: SetSchema<Value, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(set(value)).toStrictEqual(schema);
      expect(set(value, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(set(value, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies SetSchema<Value, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(set(value, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies SetSchema<Value, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = set(string());

    test('for empty set', () => {
      expectNoSchemaIssue(schema, [new Set()]);
    });

    test('for simple set', () => {
      expectNoSchemaIssue(schema, [new Set(['foo', 'bar', 'baz'])]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = set(string(), 'message');
    const baseIssue: Omit<SetIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'set',
      expected: 'Set',
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
      expectSchemaIssue(schema, baseIssue, ['', 'abc', '123']);
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

  describe('should return dataset without nested issues', () => {
    const schema = set(string());

    test('for simple set', () => {
      expectNoSchemaIssue(schema, [new Set(['foo', 'bar', 'baz'])]);
    });

    test('for nested set', () => {
      expectNoSchemaIssue(set(schema), [
        new Set([new Set(['foo', 'bar']), new Set(['baz'])]),
      ]);
    });
  });

  describe('should return dataset with nested issues', () => {
    const schema = set(string());

    const baseInfo = {
      message: expect.any(String),
      requirement: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
      skipPipe: undefined,
    };

    const stringIssue1: StringIssue = {
      ...baseInfo,
      kind: 'schema',
      type: 'string',
      input: 123,
      expected: 'string',
      received: '123',
      path: [
        {
          type: 'set',
          origin: 'value',
          input: new Set(['foo', 123, 'baz', null]),
          value: 123,
        },
      ],
    };

    test('for wrong values', () => {
      expect(
        schema._run(
          { typed: false, value: new Set(['foo', 123, 'baz', null]) },
          {}
        )
      ).toStrictEqual({
        typed: false,
        value: new Set(['foo', 123, 'baz', null]),
        issues: [
          stringIssue1,
          {
            ...baseInfo,
            kind: 'schema',
            type: 'string',
            input: null,
            expected: 'string',
            received: 'null',
            path: [
              {
                type: 'set',
                origin: 'value',
                input: new Set(['foo', 123, 'baz', null]),
                value: null,
              },
            ],
          },
        ],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('with abort early', () => {
      expect(
        schema._run(
          { typed: false, value: new Set(['foo', 123, 'baz', null]) },
          { abortEarly: true }
        )
      ).toStrictEqual({
        typed: false,
        value: new Set(['foo']),
        issues: [{ ...stringIssue1, abortEarly: true }],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('for wrong nested values', () => {
      const nestedSchema = set(schema);
      const input = new Set([new Set([123, 'foo']), 'bar', new Set()]);
      expect(
        nestedSchema._run(
          {
            typed: false,
            value: input,
          },
          {}
        )
      ).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'string',
            input: 123,
            expected: 'string',
            received: '123',
            path: [
              {
                type: 'set',
                origin: 'value',
                input,
                value: new Set([123, 'foo']),
              },
              {
                type: 'set',
                origin: 'value',
                input: new Set([123, 'foo']),
                value: 123,
              },
            ],
          },
          {
            ...baseInfo,
            kind: 'schema',
            type: 'set',
            input: 'bar',
            expected: 'Set',
            received: '"bar"',
            path: [
              {
                type: 'set',
                origin: 'value',
                input,
                value: 'bar',
              },
            ],
          },
        ],
      } satisfies UntypedDataset<InferIssue<typeof nestedSchema>>);
    });
  });
});

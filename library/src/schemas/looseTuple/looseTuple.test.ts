import { describe, expect, test } from 'vitest';
import type { FailureDataset, InferIssue } from '../../types/index.ts';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import { boolean } from '../boolean/index.ts';
import { number } from '../number/index.ts';
import { optional } from '../optional/index.ts';
import { string, type StringIssue } from '../string/index.ts';
import { looseTuple, type LooseTupleSchema } from './looseTuple.ts';
import type { LooseTupleIssue } from './types.ts';

describe('looseTuple', () => {
  describe('should return schema object', () => {
    const items = [optional(string()), number()] as const;
    type Items = typeof items;
    const baseSchema: Omit<LooseTupleSchema<Items, never>, 'message'> = {
      kind: 'schema',
      type: 'loose_tuple',
      reference: looseTuple,
      expects: 'Array',
      items,
      async: false,
      '~standard': 1,
      '~vendor': 'valibot',
      '~validate': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: LooseTupleSchema<Items, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(looseTuple(items)).toStrictEqual(schema);
      expect(looseTuple(items, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(looseTuple(items, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies LooseTupleSchema<Items, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(looseTuple(items, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies LooseTupleSchema<Items, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    test('for empty tuple', () => {
      expectNoSchemaIssue(looseTuple([]), [[]]);
    });

    const schema = looseTuple([optional(string()), number()]);

    test('for simple tuple', () => {
      expectNoSchemaIssue(schema, [
        ['foo', 123],
        [undefined, 123],
      ]);
    });

    test('for unknown items', () => {
      expectNoSchemaIssue(schema, [['foo', 123, null, true, undefined]]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = looseTuple([optional(string()), number()], 'message');
    const baseIssue: Omit<LooseTupleIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'loose_tuple',
      expected: 'Array',
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

    test('for functions', () => {
      expectSchemaIssue(schema, baseIssue, [() => {}, function () {}]);
    });

    test('for objects', () => {
      expectSchemaIssue(schema, baseIssue, [{}, { key: 'value' }]);
    });
  });

  describe('should return dataset without nested issues', () => {
    const schema = looseTuple([optional(string()), number()]);

    test('for simple tuple', () => {
      expectNoSchemaIssue(schema, [
        ['foo', 123],
        [undefined, 123],
      ]);
    });

    test('for nested tuple', () => {
      expectNoSchemaIssue(looseTuple([schema, schema]), [
        [
          ['foo', 123],
          [undefined, 123],
        ],
      ]);
    });

    test('for unknown items', () => {
      expectNoSchemaIssue(schema, [['foo', 123, null, true, undefined]]);
    });
  });

  describe('should return dataset with nested issues', () => {
    const schema = looseTuple([string(), number(), boolean()]);

    const baseInfo = {
      message: expect.any(String),
      requirement: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    const stringIssue: StringIssue = {
      ...baseInfo,
      kind: 'schema',
      type: 'string',
      input: 123,
      expected: 'string',
      received: '123',
      path: [
        {
          type: 'array',
          origin: 'value',
          input: [123, 456, 'true'],
          key: 0,
          value: 123,
        },
      ],
    };

    test('for wrong items', () => {
      const input = [123, 456, 'true'];
      expect(schema['~validate']({ value: input }, {})).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          stringIssue,
          {
            ...baseInfo,
            kind: 'schema',
            type: 'boolean',
            input: 'true',
            expected: 'boolean',
            received: '"true"',
            path: [
              {
                type: 'array',
                origin: 'value',
                input: input,
                key: 2,
                value: input[2],
              },
            ],
          },
        ],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('with abort early', () => {
      expect(
        schema['~validate']({ value: [123, 456, 'true'] }, { abortEarly: true })
      ).toStrictEqual({
        typed: false,
        value: [],
        issues: [{ ...stringIssue, abortEarly: true }],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('for wrong nested items', () => {
      const nestedSchema = looseTuple([schema, schema]);
      const input: [[string, string, boolean], null] = [
        ['foo', '123', false],
        null,
      ];
      expect(nestedSchema['~validate']({ value: input }, {})).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'number',
            input: '123',
            expected: 'number',
            received: '"123"',
            path: [
              {
                type: 'array',
                origin: 'value',
                input: input,
                key: 0,
                value: input[0],
              },
              {
                type: 'array',
                origin: 'value',
                input: input[0],
                key: 1,
                value: input[0][1],
              },
            ],
          },
          {
            ...baseInfo,
            kind: 'schema',
            type: 'loose_tuple',
            input: null,
            expected: 'Array',
            received: 'null',
            path: [
              {
                type: 'array',
                origin: 'value',
                input: input,
                key: 1,
                value: input[1],
              },
            ],
          },
        ],
      } satisfies FailureDataset<InferIssue<typeof nestedSchema>>);
    });
  });
});

import { describe, expect, test } from 'vitest';
import type { FailureDataset, InferIssue } from '../../types/index.ts';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import { boolean } from '../boolean/index.ts';
import { null_, type NullIssue } from '../null/index.ts';
import { number } from '../number/index.ts';
import { object } from '../object/index.ts';
import { optional } from '../optional/index.ts';
import { string, type StringIssue } from '../string/index.ts';
import { tupleWithRest, type TupleWithRestSchema } from './tupleWithRest.ts';
import type { TupleWithRestIssue } from './types.ts';

describe('tupleWithRest', () => {
  describe('should return schema object', () => {
    const items = [optional(string()), number()] as const;
    type Items = typeof items;
    const rest = null_();
    type Rest = typeof rest;
    const baseSchema: Omit<
      TupleWithRestSchema<Items, Rest, never>,
      'message'
    > = {
      kind: 'schema',
      type: 'tuple_with_rest',
      reference: tupleWithRest,
      expects: 'Array',
      items,
      rest,
      async: false,
      '~standard': 1,
      '~vendor': 'valibot',
      '~validate': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: TupleWithRestSchema<Items, Rest, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(tupleWithRest(items, rest)).toStrictEqual(schema);
      expect(tupleWithRest(items, rest, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(tupleWithRest(items, rest, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies TupleWithRestSchema<Items, Rest, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(tupleWithRest(items, rest, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies TupleWithRestSchema<Items, Rest, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    test('for empty tuple', () => {
      expectNoSchemaIssue(tupleWithRest([], null_()), [[]]);
    });

    const schema = tupleWithRest([optional(string()), number()], null_());

    test('for simple tuple', () => {
      expectNoSchemaIssue(schema, [
        ['foo', 123],
        [undefined, 123],
      ]);
    });

    test('for rest items', () => {
      expectNoSchemaIssue(schema, [
        [undefined, 123, null],
        ['foo', 123, null, null, null, null],
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = tupleWithRest(
      [optional(string()), number()],
      null_(),
      'message'
    );
    const baseIssue: Omit<TupleWithRestIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'tuple_with_rest',
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
    const schema = tupleWithRest([optional(string()), number()], null_());

    test('for simple tuple', () => {
      expectNoSchemaIssue(schema, [
        ['foo', 123],
        [undefined, 123],
      ]);
    });

    test('for nested tuple', () => {
      expectNoSchemaIssue(tupleWithRest([schema, schema], null_()), [
        [['foo', 123], [undefined, 123, null, null], null],
      ]);
    });

    test('for rest items', () => {
      expectNoSchemaIssue(schema, [
        [undefined, 123, null],
        ['foo', 123, null, null, null, null],
      ]);
    });
  });

  describe('should return dataset with nested issues', () => {
    const schema = tupleWithRest([string(), number(), boolean()], null_());

    const baseInfo = {
      message: expect.any(String),
      requirement: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    const input = [123, 456, 'true', null, null, null];

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
          input,
          key: 0,
          value: 123,
        },
      ],
    };

    test('for invalid items', () => {
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
        schema['~validate']({ value: input }, { abortEarly: true })
      ).toStrictEqual({
        typed: false,
        value: [],
        issues: [{ ...stringIssue, abortEarly: true }],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('for invalid nested items', () => {
      const nestedSchema = tupleWithRest([schema, schema], null_());
      const input: [[string, string, boolean], null, null] = [
        ['foo', '123', false],
        null,
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
            type: 'tuple_with_rest',
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

    const nullIssue: NullIssue = {
      ...baseInfo,
      kind: 'schema',
      type: 'null',
      input: 'null',
      expected: 'null',
      received: '"null"',
      path: [
        {
          type: 'array',
          origin: 'value',
          input: ['foo', 456, true, null, 'null', null, undefined],
          key: 4,
          value: 'null',
        },
      ],
    };

    test('for invalid rest', () => {
      const input = ['foo', 456, true, null, 'null', null, undefined];
      expect(schema['~validate']({ value: input }, {})).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          nullIssue,
          {
            ...baseInfo,
            kind: 'schema',
            type: 'null',
            input: undefined,
            expected: 'null',
            received: 'undefined',
            path: [
              {
                type: 'array',
                origin: 'value',
                input: input,
                key: 6,
                value: input[6],
              },
            ],
          },
        ],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('for invalid rest with abort early', () => {
      expect(
        schema['~validate'](
          { value: ['foo', 456, true, null, 'null', null, undefined] },
          { abortEarly: true }
        )
      ).toStrictEqual({
        typed: false,
        value: ['foo', 456, true, null],
        issues: [{ ...nullIssue, abortEarly: true }],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('for invalid nested rest', () => {
      const nestedSchema = tupleWithRest([string()], object({ key: number() }));
      const input = [
        'foo',
        { key: '123' },
        { key: 456 },
        { key: null },
      ] as const;
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
                key: 1,
                value: input[1],
              },
              {
                type: 'object',
                origin: 'value',
                input: input[1],
                key: 'key',
                value: input[1].key,
              },
            ],
          },
          {
            ...baseInfo,
            kind: 'schema',
            type: 'number',
            input: null,
            expected: 'number',
            received: 'null',
            path: [
              {
                type: 'array',
                origin: 'value',
                input: input,
                key: 3,
                value: input[3],
              },
              {
                type: 'object',
                origin: 'value',
                input: input[3],
                key: 'key',
                value: input[3].key,
              },
            ],
          },
        ],
      } satisfies FailureDataset<InferIssue<typeof nestedSchema>>);
    });
  });
});

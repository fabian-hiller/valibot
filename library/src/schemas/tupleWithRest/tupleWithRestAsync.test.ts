import { describe, expect, test } from 'vitest';
import type { InferIssue, UntypedDataset } from '../../types/index.ts';
import {
  expectNoSchemaIssueAsync,
  expectSchemaIssueAsync,
} from '../../vitest/index.ts';
import { boolean } from '../boolean/index.ts';
import { null_, type NullIssue } from '../null/index.ts';
import { number } from '../number/index.ts';
import { optionalAsync } from '../optional/index.ts';
import { string, type StringIssue } from '../string/index.ts';
import {
  tupleWithRestAsync,
  type TupleWithRestSchemaAsync,
} from './tupleWithRestAsync.ts';
import type { TupleWithRestIssue } from './types.ts';

describe('tupleWithRestAsync', () => {
  describe('should return schema object', () => {
    const items = [optionalAsync(string()), number()] as const;
    type Items = typeof items;
    const rest = null_();
    type Rest = typeof rest;
    const baseSchema: Omit<
      TupleWithRestSchemaAsync<Items, Rest, never>,
      'message'
    > = {
      kind: 'schema',
      type: 'tuple_with_rest',
      reference: tupleWithRestAsync,
      expects: 'Array',
      items,
      rest,
      async: true,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: TupleWithRestSchemaAsync<Items, Rest, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(tupleWithRestAsync(items, rest)).toStrictEqual(schema);
      expect(tupleWithRestAsync(items, rest, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(tupleWithRestAsync(items, rest, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies TupleWithRestSchemaAsync<Items, Rest, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(tupleWithRestAsync(items, rest, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies TupleWithRestSchemaAsync<Items, Rest, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    test('for empty tuple', async () => {
      await expectNoSchemaIssueAsync(tupleWithRestAsync([], null_()), [[]]);
    });

    const schema = tupleWithRestAsync(
      [optionalAsync(string()), number()],
      null_()
    );

    test('for simple tuple', async () => {
      await expectNoSchemaIssueAsync(schema, [
        ['foo', 123],
        [undefined, 123],
      ]);
    });

    test('for rest items', async () => {
      await expectNoSchemaIssueAsync(schema, [
        [undefined, 123, null],
        ['foo', 123, null, null, null, null],
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = tupleWithRestAsync(
      [optionalAsync(string()), number()],
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

    test('for bigints', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [-1n, 0n, 123n]);
    });

    test('for booleans', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [true, false]);
    });

    test('for null', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [null]);
    });

    test('for numbers', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [-1, 0, 123, 45.67]);
    });

    test('for undefined', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [undefined]);
    });

    test('for strings', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, ['', 'abc', '123']);
    });

    test('for symbols', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [
        Symbol(),
        Symbol('foo'),
      ]);
    });

    // Complex types

    test('for functions', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [
        () => {},
        function () {},
      ]);
    });

    test('for objects', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [{}, { key: 'value' }]);
    });
  });

  describe('should return dataset without nested issues', () => {
    const schema = tupleWithRestAsync(
      [optionalAsync(string()), number()],
      null_()
    );

    test('for simple tuple', async () => {
      await expectNoSchemaIssueAsync(schema, [
        ['foo', 123],
        [undefined, 123],
      ]);
    });

    test('for nested tuple', async () => {
      await expectNoSchemaIssueAsync(
        tupleWithRestAsync([schema, schema], null_()),
        [[['foo', 123], [undefined, 123, null, null], null]]
      );
    });

    test('for rest items', async () => {
      await expectNoSchemaIssueAsync(schema, [
        [undefined, 123, null],
        ['foo', 123, null, null, null, null],
      ]);
    });
  });

  describe('should return dataset with nested issues', () => {
    const schema = tupleWithRestAsync([string(), number(), boolean()], null_());

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
          type: 'tuple',
          origin: 'value',
          input: [123, 456, 'true', null, null, null],
          key: 0,
          value: 123,
        },
      ],
    };

    test('for wrong items', async () => {
      const input = [123, 456, 'true', null, null, null];
      expect(
        await schema._run({ typed: false, value: input }, {})
      ).toStrictEqual({
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
                type: 'tuple',
                origin: 'value',
                input: input,
                key: 2,
                value: input[2],
              },
            ],
          },
        ],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('with abort early', async () => {
      expect(
        await schema._run(
          {
            typed: false,
            value: [123, 456, 'true', null, null, null],
          },
          { abortEarly: true }
        )
      ).toStrictEqual({
        typed: false,
        value: [],
        issues: [{ ...stringIssue, abortEarly: true }],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('for wrong nested items', async () => {
      const nestedSchema = tupleWithRestAsync([schema, schema], null_());
      const input: [[string, string, boolean], null, null] = [
        ['foo', '123', false],
        null,
        null,
      ];
      expect(
        await nestedSchema._run({ typed: false, value: input }, {})
      ).toStrictEqual({
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
                type: 'tuple',
                origin: 'value',
                input: input,
                key: 0,
                value: input[0],
              },
              {
                type: 'tuple',
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
                type: 'tuple',
                origin: 'value',
                input: input,
                key: 1,
                value: input[1],
              },
            ],
          },
        ],
      } satisfies UntypedDataset<InferIssue<typeof nestedSchema>>);
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
          type: 'tuple',
          origin: 'value',
          input: ['foo', 456, true, null, 'null', null, undefined],
          key: 4,
          value: 'null',
        },
      ],
    };

    test('for wrong rest', async () => {
      const input = ['foo', 456, true, null, 'null', null, undefined];
      expect(
        await schema._run({ typed: false, value: input }, {})
      ).toStrictEqual({
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
                type: 'tuple',
                origin: 'value',
                input: input,
                key: 6,
                value: input[6],
              },
            ],
          },
        ],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('for wrong rest with abort early', async () => {
      expect(
        await schema._run(
          {
            typed: false,
            value: ['foo', 456, true, null, 'null', null, undefined],
          },
          { abortEarly: true }
        )
      ).toStrictEqual({
        typed: false,
        value: ['foo', 456, true, null],
        issues: [{ ...nullIssue, abortEarly: true }],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });
  });
});

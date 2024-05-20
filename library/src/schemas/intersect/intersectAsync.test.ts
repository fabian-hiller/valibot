import { describe, expect, test } from 'vitest';
import { minLength, minValue, transform } from '../../actions/index.ts';
import { pipe } from '../../methods/index.ts';
import type {
  InferIssue,
  InferOutput,
  TypedDataset,
  UntypedDataset,
} from '../../types/index.ts';
import { expectNoSchemaIssueAsync } from '../../vitest/index.ts';
import { array } from '../array/array.ts';
import { arrayAsync } from '../array/arrayAsync.ts';
import { date } from '../date/index.ts';
import { number } from '../number/index.ts';
import { object, objectAsync } from '../object/index.ts';
import { string } from '../string/index.ts';
import { intersectAsync, type IntersectSchemaAsync } from './intersectAsync.ts';

describe('intersectAsync', () => {
  describe('should return schema object', () => {
    const options = [
      object({ key1: string() }),
      objectAsync({ key2: number() }),
    ] as const;
    type Options = typeof options;
    const baseSchema: Omit<IntersectSchemaAsync<Options, never>, 'message'> = {
      kind: 'schema',
      type: 'intersect',
      reference: intersectAsync,
      expects: 'Object',
      options,
      async: true,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: IntersectSchemaAsync<Options, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(intersectAsync(options)).toStrictEqual(schema);
      expect(intersectAsync(options, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(intersectAsync(options, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies IntersectSchemaAsync<Options, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(intersectAsync(options, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies IntersectSchemaAsync<Options, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    test('for valid values', async () => {
      await expectNoSchemaIssueAsync(
        intersectAsync([
          array(object({ key1: string(), key2: number() })),
          arrayAsync(objectAsync({ key3: date(), key4: array(string()) })),
        ]),
        [
          [
            { key1: 'foo', key2: 123, key3: new Date(), key4: ['foo', 'bar'] },
            { key1: 'bar', key2: -456, key3: new Date(), key4: ['baz'] },
          ],
        ]
      );
    });
  });

  describe('should return dataset with issues', () => {
    const baseInfo = {
      message: expect.any(String),
      requirement: undefined,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
      skipPipe: undefined,
    };

    test('for empty options', async () => {
      const schema = intersectAsync([]);
      const input = 'foo';
      expect(
        await schema._run({ typed: false, value: input }, {})
      ).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'intersect',
            input,
            expected: 'never',
            received: `"${input}"`,
          },
        ],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('with untyped output', async () => {
      const schema = intersectAsync([string(), number()]);
      const input = 'foo';
      expect(
        await schema._run({ typed: false, value: input }, {})
      ).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'number',
            input,
            expected: 'number',
            received: `"${input}"`,
          },
        ],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('with typed output', async () => {
      const schema = intersectAsync([
        object({ key1: pipe(string(), minLength(10)) }),
        objectAsync({ key2: pipe(number(), minValue(100)) }),
      ]);
      type Schema = typeof schema;
      const input = { key1: 'foo', key2: -123 };
      expect(
        await schema._run({ typed: false, value: input }, {})
      ).toStrictEqual({
        typed: true,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'validation',
            type: 'min_length',
            input: input.key1,
            expected: '>=10',
            received: '3',
            requirement: 10,
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'key1',
                value: input.key1,
              },
            ],
          },
          {
            ...baseInfo,
            kind: 'validation',
            type: 'min_value',
            input: input.key2,
            expected: '>=100',
            received: '-123',
            requirement: 100,
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'key2',
                value: input.key2,
              },
            ],
          },
        ],
      } satisfies TypedDataset<InferOutput<Schema>, InferIssue<Schema>>);
    });

    test('with abort early', async () => {
      const schema = intersectAsync([
        object({ key1: pipe(string(), minLength(10)) }),
        objectAsync({ key2: pipe(number(), minValue(100)) }),
      ]);
      const input = { key1: 'foo', key2: -123 };
      expect(
        await schema._run({ typed: false, value: input }, { abortEarly: true })
      ).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            abortEarly: true,
            kind: 'validation',
            type: 'min_length',
            input: input.key1,
            expected: '>=10',
            received: '3',
            requirement: 10,
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'key1',
                value: input.key1,
              },
            ],
          },
        ],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('for merge error', async () => {
      const schema = intersectAsync([
        object({ key: string() }),
        objectAsync({
          key: pipe(
            string(),
            transform((input) => input.length)
          ),
        }),
      ]);
      const input = { key: 'foo' };
      expect(
        await schema._run({ typed: false, value: input }, {})
      ).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'intersect',
            input: input,
            expected: 'Object',
            received: 'unknown',
          },
        ],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });
  });
});

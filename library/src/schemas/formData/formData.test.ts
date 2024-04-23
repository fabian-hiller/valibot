import { describe, expect, test } from 'vitest';
import type {
  BaseIssue,
  BaseSchema,
  InferIssue,
  InferOutput,
  TypedDataset,
  UntypedDataset,
} from '../../types/index.ts';
import { expectSchemaIssue } from '../../vitest/index.ts';
import type { ArrayIssue } from '../array/index.ts';
import { array } from '../array/index.ts';
import { bigint } from '../bigint/bigint.ts';
import { boolean } from '../boolean/index.ts';
import { date } from '../date/index.ts';
import { instance } from '../instance/index.ts';
import { nullable } from '../nullable/index.ts';
import { nullish } from '../nullish/index.ts';
import type { NumberIssue } from '../number/index.ts';
import { number } from '../number/index.ts';
import type { ObjectIssue } from '../object/index.ts';
import { object } from '../object/index.ts';
import { optional } from '../optional/optional.ts';
import { string, type StringIssue } from '../string/index.ts';
import { formData, type FormDataSchema } from './formData.ts';
import type { FormDataIssue } from './types.ts';

describe('formData', () => {
  describe('should return schema formData', () => {
    const entries = { key: string() };
    type Entries = typeof entries;
    const baseSchema: Omit<FormDataSchema<Entries, never>, 'message'> = {
      kind: 'schema',
      type: 'formData',
      expects: 'FormData',
      entries,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: FormDataSchema<Entries, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(formData(entries)).toStrictEqual(schema);
      expect(formData(entries, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(formData(entries, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies FormDataSchema<Entries, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(formData(entries, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies FormDataSchema<Entries, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    test('for empty object', () => {
      const schema = formData({});
      const input = new FormData();
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: true,
        value: {},
      } satisfies TypedDataset<
        InferOutput<typeof schema>,
        InferIssue<typeof schema>
      >);
    });

    test('for simple object', () => {
      const schema = formData({ key1: string(), key2: number() });
      const input = new FormData();
      input.append('key1', 'foo');
      input.append('key2', '123');
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: true,
        value: { key1: 'foo', key2: 123 },
      } satisfies TypedDataset<
        InferOutput<typeof schema>,
        InferIssue<typeof schema>
      >);
    });

    test('for bigints', () => {
      const schema = formData({
        key1: bigint(),
        key2: bigint(),
        key3: nullish(bigint()),
        key4: optional(bigint()),
      });
      const input = new FormData();
      input.append('key1', '2147483647');
      input.append('key2', '-9223372036854775807');
      input.append('key3', '');
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: true,
        value: { key1: 2147483647n, key2: -9223372036854775807n, key3: null },
      } satisfies TypedDataset<
        InferOutput<typeof schema>,
        InferIssue<typeof schema>
      >);
    });

    test('for booleans', () => {
      const schema = formData({
        key1: boolean(),
        key2: boolean(),
        key3: nullish(boolean()),
        key4: optional(boolean()),
      });
      const input = new FormData();
      input.append('key1', 'true');
      input.append('key2', 'false');
      input.append('key3', '');
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: true,
        value: { key1: true, key2: false, key3: null },
      } satisfies TypedDataset<
        InferOutput<typeof schema>,
        InferIssue<typeof schema>
      >);
    });

    test('for numbers', () => {
      const schema = formData({
        key1: number(),
        key2: number(),
        key3: nullish(number()),
        key4: optional(number()),
      });
      const input = new FormData();
      input.append('key1', '123');
      input.append('key2', '-4.56');
      input.append('key3', '');
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: true,
        value: { key1: 123, key2: -4.56, key3: null },
      } satisfies TypedDataset<
        InferOutput<typeof schema>,
        InferIssue<typeof schema>
      >);
    });

    test('for strings', () => {
      const schema = formData({
        key1: string(),
        key2: nullish(string()),
        key3: optional(string()),
      });
      const input = new FormData();
      input.append('key1', 'foo');
      input.append('key2', '');
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: true,
        value: { key1: 'foo', key2: null },
      } satisfies TypedDataset<
        InferOutput<typeof schema>,
        InferIssue<typeof schema>
      >);
    });

    test('for dates', () => {
      const schema = formData({
        key1: date(),
        key2: date(),
        key3: nullish(date()),
        key4: optional(date()),
      });
      const input = new FormData();
      input.append('key1', '2021-01-01T00:00:00Z');
      input.append('key2', '1609459200000');
      input.append('key3', '');
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: true,
        value: {
          key1: new Date('2021-01-01T00:00:00Z'),
          key2: new Date('2021-01-01T00:00:00Z'),
          key3: null,
        },
      } satisfies TypedDataset<
        InferOutput<typeof schema>,
        InferIssue<typeof schema>
      >);
    });

    test('for files', () => {
      const value = new File(['foo'], 'bar.txt', { type: 'text/plain' });
      const schema = formData({
        key1: instance(File),
        key2: nullish(instance(File)),
        key3: optional(instance(File)),
      });
      const input = new FormData();
      input.append('key1', value);
      input.append('key2', '');
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: true,
        value: { key1: value, key2: null },
      } satisfies TypedDataset<
        InferOutput<typeof schema>,
        InferIssue<typeof schema>
      >);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = formData({}, 'message');
    const baseIssue: Omit<FormDataIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'formData',
      expected: 'FormData',
      message: 'message',
    };

    const expectFormDataSchemaIssue = <
      TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
    >(
      schema: TSchema,
      input: unknown,
      { key, type, value }: { key: string; type: string; value: string }
    ) => {
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: false,
        value: { [key]: value },
        issues: [
          {
            requirement: undefined,
            path: [
              {
                type: 'formData',
                origin: 'value',
                input,
                key,
                value: value,
              },
            ],
            issues: undefined,
            lang: undefined,
            abortEarly: undefined,
            abortPipeEarly: undefined,
            skipPipe: undefined,
            kind: 'schema',
            type: type.charAt(0).toLowerCase() + type.slice(1),
            expected: type,
            message: `Invalid type: Expected ${type} but received "${value}"`,
            input: value,
            received: `"${value}"`,
          },
        ],
      } satisfies UntypedDataset<InferIssue<TSchema>>);
    };

    // Primitive types

    test('for bigints', () => {
      const schema = formData({ key: bigint() }, 'message');
      const input = new FormData();
      input.append('key', 'invalid bigint');
      expectFormDataSchemaIssue(schema, input, {
        key: 'key',
        type: 'bigint',
        value: 'invalid bigint',
      });
      expectSchemaIssue(schema, baseIssue, [-1n, 0n, 123n]);
    });

    test('for booleans', () => {
      const schema = formData({ key: boolean() }, 'message');
      const input = new FormData();
      input.append('key', 'invalid boolean');
      expectFormDataSchemaIssue(schema, input, {
        key: 'key',
        type: 'boolean',
        value: 'invalid boolean',
      });
      expectSchemaIssue(schema, baseIssue, [true, false]);
    });

    test('for null', () => {
      expectSchemaIssue(schema, baseIssue, [null]);
    });

    test('for numbers', () => {
      const schema = formData({ key: number() }, 'message');
      const input = new FormData();
      input.append('key', 'invalid number');
      expectFormDataSchemaIssue(schema, input, {
        key: 'key',
        type: 'number',
        value: 'invalid number',
      });
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

    test('for dates', () => {
      const schema = formData({ key: date() }, 'message');
      const input = new FormData();
      input.append('key', 'invalid date');
      expectFormDataSchemaIssue(schema, input, {
        key: 'key',
        type: 'Date',
        value: 'invalid date',
      });
      expectSchemaIssue(schema, baseIssue, [
        new Date(),
        new Date('2021-01-01'),
      ]);
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
    test('for simple array', () => {
      const schema = formData({ key1: array(string()), key2: array(number()) });
      const input = new FormData();
      input.append('key1', 'foo');
      input.append('key2', '123');
      input.append('key2', '456');
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: true,
        value: { key1: ['foo'], key2: [123, 456] },
      } satisfies TypedDataset<
        InferOutput<typeof schema>,
        InferIssue<typeof schema>
      >);
    });

    test('for simple object', () => {
      const schema = formData({ key1: string(), key2: number() });
      const input = new FormData();
      input.append('key1', 'foo');
      input.append('key2', '123');
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: true,
        value: { key1: 'foo', key2: 123 },
      } satisfies TypedDataset<
        InferOutput<typeof schema>,
        InferIssue<typeof schema>
      >);
    });

    test('for nested array', () => {
      const schema = formData({
        nested: array(object({ key: array(string()) })),
      });
      const input = new FormData();
      input.append('nested.0.key', 'foo');
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: true,
        value: { nested: [{ key: ['foo'] }] },
      } satisfies TypedDataset<
        InferOutput<typeof schema>,
        InferIssue<typeof schema>
      >);
    });

    test('for nested object', () => {
      const schema = formData({ nested: object({ key: string() }) });
      const input = new FormData();
      input.append('nested.key', 'foo');
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: true,
        value: { nested: { key: 'foo' } },
      } satisfies TypedDataset<
        InferOutput<typeof schema>,
        InferIssue<typeof schema>
      >);
    });

    // test('for optional object', () => {
    //   const schema = formData({ key: optional(object({ key: string() })) });
    //   const input = new FormData();
    //   expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
    //     typed: true,
    //     value: {},
    //   } satisfies TypedDataset<
    //     InferOutput<typeof schema>,
    //     InferIssue<typeof schema>
    //   >);
    // });

    // test('for optional array', () => {
    //   const schema = formData({ key: optional(array(string())) });
    //   const input = new FormData();
    //   expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
    //     typed: true,
    //     value: {},
    //   } satisfies TypedDataset<
    //     InferOutput<typeof schema>,
    //     InferIssue<typeof schema>
    //   >);
    // });

    test('for optional entry', () => {
      const schema = formData({ key: optional(string()) });
      const input = new FormData();
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: true,
        value: {},
      } satisfies TypedDataset<
        InferOutput<typeof schema>,
        InferIssue<typeof schema>
      >);
    });

    test('for nullish entry', () => {
      const schema = formData({ key: nullish(number()) });
      const input = new FormData();
      input.append('key', '');
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: true,
        value: { key: null },
      } satisfies TypedDataset<
        InferOutput<typeof schema>,
        InferIssue<typeof schema>
      >);
    });

    test('for unknown entries', () => {
      const schema = formData({ key1: string() });
      const input = new FormData();
      input.append('key1', 'foo');
      input.append('key2', '123');
      input.append('key3', '');
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: true,
        value: { key1: 'foo' },
      } satisfies TypedDataset<
        InferOutput<typeof schema>,
        InferIssue<typeof schema>
      >);
    });

    test('for existent object schema', () => {
      const existentSchema = optional(nullable(object({ key: string() })));
      const schema = formData(existentSchema);
      const input = new FormData();
      input.append('key', 'value');
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: true,
        value: { key: 'value' },
      } satisfies TypedDataset<
        InferOutput<typeof schema>,
        InferIssue<typeof schema>
      >);
    });
  });

  describe('should return dataset with nested issues', () => {
    const schema = formData({
      key: string(),
      list: array(object({ nested: array(number()) })),
      nested: object({ key: number(), value: optional(string()) }),
    });

    const baseInfo = {
      message: expect.any(String),
      requirement: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
      skipPipe: undefined,
    };

    const stringIssue = (input: FormData): StringIssue => ({
      ...baseInfo,
      kind: 'schema',
      type: 'string',
      input: undefined,
      expected: 'string',
      received: 'undefined',
      path: [
        {
          type: 'formData',
          origin: 'value',
          input,
          key: 'key',
          value: undefined,
        },
      ],
    });

    const objectIssue = (input: FormData): ObjectIssue => ({
      ...baseInfo,
      kind: 'schema',
      type: 'object',
      input: undefined,
      expected: 'Object',
      received: 'undefined',
      path: [
        {
          type: 'formData',
          origin: 'value',
          input,
          key: 'nested',
          value: undefined,
        },
      ],
    });

    const arrayIssue = (input: FormData): ArrayIssue => ({
      ...baseInfo,
      kind: 'schema',
      type: 'array',
      input: undefined,
      expected: 'Array',
      received: 'undefined',
      path: [
        {
          type: 'formData',
          origin: 'value',
          input,
          key: 'list',
          value: undefined,
        },
      ],
    });

    const numberIssue = (input: FormData): NumberIssue => ({
      ...baseInfo,
      kind: 'schema',
      type: 'number',
      input: undefined,
      expected: 'number',
      received: 'undefined',
      path: [
        {
          type: 'formData',
          origin: 'value',
          input,
          key: 'nested',
          value: undefined,
        },
        {
          type: 'formData',
          origin: 'value',
          input,
          key: 'nested.key',
          value: undefined,
        },
      ],
    });

    test('for missing entries', () => {
      const input = new FormData();
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: false,
        value: {},
        issues: [
          stringIssue(input),
          arrayIssue(input),
          numberIssue(input),
          objectIssue(input),
        ],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('for missing nested array entries', () => {
      const input = new FormData();
      input.append('key', 'value');
      input.append('nested.key', '123');
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: false,
        value: { key: 'value', nested: { key: 123 } },
        issues: [arrayIssue(input)],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('for missing nested object entries', () => {
      const input = new FormData();
      input.append('key', 'value');
      input.append('list.0.nested', '123');
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: false,
        value: { key: 'value', list: [{ nested: [123] }] },
        issues: [numberIssue(input), objectIssue(input)],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('with abort early', () => {
      const input = new FormData();
      expect(
        schema._run({ typed: false, value: input }, { abortEarly: true })
      ).toStrictEqual({
        typed: false,
        value: {},
        issues: [{ ...stringIssue(input), abortEarly: true }],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('for wrong nested array entries', () => {
      const input = new FormData();
      input.append('key', 'value');
      input.append('list.0.nested', '123');
      input.append('list.0.nested', 'foo');
      input.append('nested.key', '123');
      expect(schema._run({ typed: false, value: input }, {})).toStrictEqual({
        typed: false,
        value: {
          key: 'value',
          list: [{ nested: [123, 'foo'] }],
          nested: { key: 123 },
        },
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'number',
            input: 'foo',
            expected: 'number',
            received: '"foo"',
            path: [
              {
                type: 'formData',
                origin: 'value',
                input,
                key: 'list',
                value: [{ nested: [123, 'foo'] }],
              },
              {
                type: 'formData',
                origin: 'value',
                input,
                key: 'list.0',
                value: { nested: [123, 'foo'] },
              },
              {
                type: 'formData',
                origin: 'value',
                input,
                key: 'list.0.nested',
                value: [123, 'foo'],
              },
              {
                type: 'formData',
                origin: 'value',
                input,
                key: 'list.0.nested',
                value: 'foo',
              },
            ],
          },
        ],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });

    test('for wrong nested array entries with abort early', () => {
      const input = new FormData();
      input.append('key', 'value');
      input.append('list.0.nested', '123');
      input.append('list.0.nested', 'foo');
      input.append('nested.key', '123');
      expect(
        schema._run({ typed: false, value: input }, { abortEarly: true })
      ).toStrictEqual({
        typed: false,
        value: { key: 'value', list: [{ nested: [123, 'foo'] }] },
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'number',
            input: 'foo',
            expected: 'number',
            received: '"foo"',
            path: [
              {
                type: 'formData',
                origin: 'value',
                input,
                key: 'list',
                value: [{ nested: [123, 'foo'] }],
              },
              {
                type: 'formData',
                origin: 'value',
                input,
                key: 'list.0',
                value: { nested: [123, 'foo'] },
              },
              {
                type: 'formData',
                origin: 'value',
                input,
                key: 'list.0.nested',
                value: [123, 'foo'],
              },
              {
                type: 'formData',
                origin: 'value',
                input,
                key: 'list.0.nested',
                value: 'foo',
              },
            ],
            abortEarly: true,
          },
        ],
      } satisfies UntypedDataset<InferIssue<typeof schema>>);
    });
  });
});

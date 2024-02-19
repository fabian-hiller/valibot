import { describe, expect, test } from 'vitest';
import { type ValiError } from '../../error/index.ts';
import { parse } from '../../methods/index.ts';
import { toCustom } from '../../transformations/index.ts';
import type {
  Output,
  TypedSchemaResult,
  UntypedSchemaResult,
} from '../../types/index.ts';
import { custom, minLength } from '../../validations/index.ts';
import { never } from '../never/index.ts';
import { number } from '../number/index.ts';
import { optional } from '../optional/index.ts';
import { string } from '../string/index.ts';
import { object } from './object.ts';

describe('object', () => {
  test('should pass only objects', () => {
    const schema1 = object({ key1: string(), key2: number() });
    const input1 = { key1: 'test', key2: 123 };
    const output1 = parse(schema1, input1);
    expect(output1).toEqual(input1);
    const input2 = { ...input1, key3: null };
    const outpu2 = parse(schema1, input2);
    expect(outpu2).toEqual(input1);
    expect(() => parse(schema1, 'test')).toThrowError();
    expect(() => parse(schema1, 123)).toThrowError();
    expect(() => parse(schema1, {})).toThrowError();
    expect(() => parse(schema1, new Map())).toThrowError();

    const schema2 = object({ key1: string() }, number());
    const input3 = { key1: 'test' };
    const output3 = parse(schema2, input3);
    expect(output3).toEqual(input3);
    const input4 = { key1: 'test', key2: 123, key3: 456 };
    const output4 = parse(schema2, input4);
    expect(output4).toEqual(input4);
    expect(() => parse(schema2, { key1: 'test', key2: '123' })).toThrowError();

    const schema3 = object({ key1: string() }, never());
    const input5 = { key1: 'test' };
    const output5 = parse(schema2, input5);
    expect(output5).toEqual(input5);
    expect(() => parse(schema3, { key1: 'test', key2: null })).toThrowError();
  });

  test('should exclude non-existing keys', () => {
    const schema = object({ key: optional(string()) });
    const output1 = parse(schema, { key: undefined });
    expect('key' in output1).toBe(true);
    const output2 = parse(schema, {});
    expect('key' in output2).toBe(false);
  });

  test('should throw custom error', () => {
    const error = 'Value is not an object!';
    const schema = object({}, error);
    expect(() => parse(schema, 123)).toThrowError(error);
  });

  test('should throw every issue', () => {
    const schema = object({ key1: string(), key2: string() }, number());
    const input = { key1: 1, key2: 2, key3: 3, key4: '4', key5: '5' };
    expect(() => parse(schema, input)).toThrowError();
    try {
      parse(schema, input);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(4);
    }
  });

  test('should throw only first issue', () => {
    const config = { abortEarly: true };
    const schema = object({ key1: string(), key2: string() }, number());

    const input1 = { key1: 1, key2: 2, key3: 3, key4: '4' };
    expect(() => parse(schema, input1, config)).toThrowError();
    try {
      parse(schema, input1, config);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
    }

    const input2 = { key1: '1', key2: '2', key3: '3', key4: '4' };
    expect(() => parse(schema, input2, config)).toThrowError();
    try {
      parse(schema, input2, config);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
    }
  });

  test('should return issue path', () => {
    const schema1 = object({ key: number() });
    const input1 = { key: '123' };
    const result1 = schema1._parse(input1);
    expect(result1.issues?.[0].path).toEqual([
      {
        type: 'object',
        origin: 'value',
        input: input1,
        key: 'key',
        value: input1.key,
      },
    ]);

    const schema2 = object({ nested: object({ key: string() }) });
    const input2 = { nested: { key: 123 } };
    const result2 = schema2._parse(input2);
    expect(result2.issues?.[0].path).toEqual([
      {
        type: 'object',
        origin: 'value',
        input: input2,
        key: 'nested',
        value: input2.nested,
      },
      {
        type: 'object',
        origin: 'value',
        input: input2.nested,
        key: 'key',
        value: input2.nested.key,
      },
    ]);

    const schema3 = object({ key1: string() }, number());
    const input3 = { key1: 'hello', key2: 'world' };
    const result3 = schema3._parse(input3);
    expect(result3.issues?.[0].path).toEqual([
      {
        type: 'object',
        origin: 'value',
        input: input3,
        key: 'key2',
        value: input3.key2,
      },
    ]);

    const schema4 = object({}, object({ key: string() }));
    const input4 = { nested: { key: 123 } };
    const result4 = schema4._parse(input4);
    expect(result4.issues?.[0].path).toEqual([
      {
        type: 'object',
        origin: 'value',
        input: input4,
        key: 'nested',
        value: input4.nested,
      },
      {
        type: 'object',
        origin: 'value',
        input: input4.nested,
        key: 'key',
        value: input4.nested.key,
      },
    ]);
  });

  test('should execute pipe', () => {
    const input = { key1: '1', key2: 1 };
    const transformInput = () => ({ key1: '2', key2: 2 });
    const output1 = parse(
      object({ key1: string(), key2: number() }, [toCustom(transformInput)]),
      input
    );
    const output2 = parse(
      object({ key1: string(), key2: number() }, 'Error', [
        toCustom(transformInput),
      ]),
      input
    );
    expect(output1).toEqual(transformInput());
    expect(output2).toEqual(transformInput());
  });

  test('should execute pipe if output is typed', () => {
    const requirement = (value: { key: string }) => value.key.length >= 10;
    const schema = object({ key: string([minLength(10)]) }, [
      custom(requirement),
    ]);
    const input = { key: '12345' };
    const result = schema._parse(input);
    expect(result).toEqual({
      typed: true,
      output: input,
      issues: [
        {
          reason: 'string',
          context: 'min_length',
          expected: '>=10',
          received: '5',
          message: 'Invalid length: Expected >=10 but received 5',
          input: input.key,
          requirement: 10,
          path: [
            {
              type: 'object',
              origin: 'value',
              input: input,
              key: 'key',
              value: input.key,
            },
          ],
        },
        {
          reason: 'object',
          context: 'custom',
          expected: null,
          received: 'Object',
          message: 'Invalid input: Received Object',
          input: input,
          requirement,
        },
      ],
    } satisfies TypedSchemaResult<Output<typeof schema>>);
  });

  test('should skip pipe if output is not typed', () => {
    const schema = object({ key: string() }, [
      custom((value) => value.key.length >= 10),
    ]);
    const input = { key: 12345 };
    const result = schema._parse(input);
    expect(result).toEqual({
      typed: false,
      output: input,
      issues: [
        {
          reason: 'type',
          context: 'string',
          expected: 'string',
          received: '12345',
          message: 'Invalid type: Expected string but received 12345',
          input: input.key,
          path: [
            {
              type: 'object',
              origin: 'value',
              input: input,
              key: 'key',
              value: input.key,
            },
          ],
        },
      ],
    } satisfies UntypedSchemaResult);
  });
});

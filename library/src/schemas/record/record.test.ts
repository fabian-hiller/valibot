import { describe, expect, test } from 'vitest';
import { type ValiError } from '../../error/index.ts';
import { parse } from '../../methods/index.ts';
import { toCustom } from '../../transformations/index.ts';
import type {
  Output,
  TypedSchemaResult,
  UntypedSchemaResult,
} from '../../types/index.ts';
import { custom, maxLength, minLength } from '../../validations/index.ts';
import { any } from '../any/index.ts';
import { number } from '../number/index.ts';
import { object } from '../object/index.ts';
import { string } from '../string/index.ts';
import { union } from '../union/index.ts';
import { record } from './record.ts';

describe('record', () => {
  test('should pass only objects', () => {
    const schema1 = record(number());
    const input1 = { key1: 1, key2: 2 };
    const output1 = parse(schema1, input1);
    expect(output1).toEqual(input1);
    expect(() => parse(schema1, { test: 'hello' })).toThrowError();
    expect(() => parse(schema1, 'test')).toThrowError();
    expect(() => parse(schema1, 123)).toThrowError();

    const schema2 = record(string([minLength(3)]), union([string(), number()]));
    const input2 = { 1234: 1234, test: 'hello' };
    const output2 = parse(schema2, input2);
    expect(output2).toEqual(input2);
    expect(() => parse(schema2, { a: 'test' })).toThrowError();
    expect(() => parse(schema2, { test: null })).toThrowError();
    expect(() => parse(schema2, 'test')).toThrowError();
    expect(() => parse(schema2, 123)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an object!';
    const schema = record(string(), error);
    expect(() => parse(schema, 123)).toThrowError(error);
  });

  test('should throw every issue', () => {
    const schema1 = record(number());
    const input1 = { 1: '1', 2: 2, 3: '3', 4: '4' };
    expect(() => parse(schema1, input1)).toThrowError();
    try {
      parse(schema1, input1);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(3);
    }

    const schema2 = record(string([minLength(2)]), number());
    const input2 = { '1': '1', 2: 2, 3: '3' };
    expect(() => parse(schema2, input2)).toThrowError();
    try {
      parse(schema2, input2);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(5);
    }
  });

  test('should throw only first issue', () => {
    const config = { abortEarly: true };

    const schema1 = record(number());
    const input1 = { 1: '1', 2: 2, 3: '3' };
    expect(() => parse(schema1, input1, config)).toThrowError();
    try {
      parse(schema1, input1, config);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
      expect((error as ValiError).issues[0].origin).toBe('value');
    }

    const schema2 = record(string([minLength(2)]), number());
    const input2 = { '1': '1', 2: 2, 3: '3' };
    expect(() => parse(schema2, input2, config)).toThrowError();
    try {
      parse(schema2, input2, config);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
      expect((error as ValiError).issues[0].origin).toBe('key');
    }
  });

  test('should return issue path', () => {
    const schema1 = record(number());
    const input1 = { a: 1, b: '2', c: 3 };
    const result1 = schema1._parse(input1);
    expect(result1.issues?.[0].path).toEqual([
      {
        type: 'record',
        input: input1,
        key: 'b',
        value: input1.b,
      },
    ]);

    const schema2 = record(object({ key: string() }));
    const input2 = { a: { key: 'test' }, b: { key: 123 } };
    const result2 = schema2._parse(input2);
    expect(result2.issues?.[0].origin).toBe('value');
    expect(result2.issues?.[0].path).toEqual([
      {
        type: 'record',
        input: input2,
        key: 'b',
        value: input2.b,
      },
      {
        type: 'object',
        input: input2.b,
        key: 'key',
        value: input2.b.key,
      },
    ]);

    const schema3 = record(string([maxLength(1)]), number());
    const input3 = { a: 1, bb: 2, c: 3 };
    const result3 = schema3._parse(input3);
    expect(result3.issues?.[0].origin).toBe('key');
    expect(result3.issues?.[0].path).toEqual([
      {
        type: 'record',
        input: input3,
        key: 'bb',
        value: input3.bb,
      },
    ]);
  });

  test('should execute pipe', () => {
    const input = { key1: 1, key2: 1 };
    const transformInput = (): Record<string, number> => ({ key1: 2, key2: 2 });
    const output1 = parse(record(number(), [toCustom(transformInput)]), input);
    const output2 = parse(
      record(string(), number(), [toCustom(transformInput)]),
      input
    );
    const output3 = parse(
      record(number(), 'Error', [toCustom(transformInput)]),
      input
    );
    const output4 = parse(
      record(string(), number(), 'Error', [toCustom(transformInput)]),
      input
    );
    expect(output1).toEqual(transformInput());
    expect(output2).toEqual(transformInput());
    expect(output3).toEqual(transformInput());
    expect(output4).toEqual(transformInput());
  });

  test('should prevent prototype pollution', () => {
    const schema = record(string(), any());
    const input = JSON.parse('{"__proto__":{"polluted":"yes"}}');
    expect(input.__proto__.polluted).toBe('yes');
    expect(({} as any).polluted).toBeUndefined();
    const output = parse(schema, input);
    expect(output.__proto__.polluted).toBeUndefined();
    expect(output.polluted).toBeUndefined();
  });

  test('should execute pipe if output is typed', () => {
    const requirement = (value: Record<string, string>) =>
      value.key.length >= 10;
    const schema = record(string([minLength(10)]), [custom(requirement)]);
    const input = { key: '12345' };
    const result = schema._parse(input);
    expect(result).toEqual({
      typed: true,
      output: input,
      issues: [
        {
          reason: 'string',
          validation: 'min_length',
          origin: 'value',
          expected: '>=10',
          received: '5',
          message: 'Invalid length: Expected >=10 but received 5',
          input: input.key,
          requirement: 10,
          path: [
            {
              type: 'record',
              input: input,
              key: 'key',
              value: input.key,
            },
          ],
        },
        {
          reason: 'record',
          validation: 'custom',
          expected: null,
          received: 'Object',
          origin: 'value',
          message: 'Invalid input: Received Object',
          input: input,
          requirement,
        },
      ],
    } satisfies TypedSchemaResult<Output<typeof schema>>);
  });

  test('should skip pipe if output is not typed', () => {
    const schema = record(string(), [
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
          validation: 'string',
          origin: 'value',
          expected: 'string',
          received: '12345',
          message: 'Invalid type: Expected string but received 12345',
          input: input.key,
          path: [
            {
              type: 'record',
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

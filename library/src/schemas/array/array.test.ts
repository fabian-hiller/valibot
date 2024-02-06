import { describe, expect, test } from 'vitest';
import { type ValiError } from '../../error/index.ts';
import { parse } from '../../methods/index.ts';
import type {
  Output,
  TypedSchemaResult,
  UntypedSchemaResult,
} from '../../types/index.ts';
import {
  includes,
  length,
  maxLength,
  minLength,
} from '../../validations/index.ts';
import { number } from '../number/index.ts';
import { object } from '../object/object.ts';
import { string } from '../string/index.ts';
import { array } from './array.ts';

describe('array', () => {
  test('should pass only arrays', () => {
    const schema1 = array(number());
    const input1 = [1, 2, 3];
    const output1 = parse(schema1, input1);
    expect(output1).toEqual(input1);

    const schema2 = array(schema1);
    const input2 = [input1, input1, input1];
    const output2 = parse(schema2, input2);
    expect(output2).toEqual(input2);

    const input3: number[] = [];
    const output3 = parse(schema2, input3);
    expect(output3).toEqual(input3);

    expect(() => parse(schema1, {})).toThrowError();
    expect(() => parse(schema1, 123)).toThrowError();
    expect(() => parse(schema2, input1)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an array!';
    const schema1 = array(number(), error);
    expect(() => parse(schema1, 123)).toThrowError(error);
    const schema2 = array(number(), { message: error });
    expect(() => parse(schema2, 123)).toThrowError(error);
  });

  test('should throw every issue', () => {
    const schema = array(number());
    const input = ['1', 2, '3'];
    expect(() => parse(schema, input)).toThrowError();
    try {
      parse(schema, input);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(2);
    }
  });

  test('should throw only first issue', () => {
    const schema = array(number());
    const input = ['1', 2, '3'];
    const config = { abortEarly: true };
    expect(() => parse(schema, input, config)).toThrowError();
    try {
      parse(schema, input, config);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
    }
  });

  test('should return issue path', () => {
    const schema1 = array(number());
    const input1 = [1, 2, '3', 4];
    const result1 = schema1._parse(input1);
    expect(result1.issues?.[0].path).toEqual([
      {
        type: 'array',
        origin: 'value',
        input: input1,
        key: 2,
        value: input1[2],
      },
    ]);

    const schema2 = array(object({ key: string() }));
    const input2 = [{ key: '1' }, { key: 2 }, { key: '3' }];
    const result2 = schema2._parse(input2);
    expect(result2.issues?.[0].path).toEqual([
      {
        type: 'array',
        origin: 'value',
        input: input2,
        key: 1,
        value: input2[1],
      },
      {
        type: 'object',
        origin: 'value',
        input: input2[1],
        key: 'key',
        value: input2[1].key,
      },
    ]);
  });

  test('should execute pipe', () => {
    const lengthError = 'Invalid length';
    const contentError = 'Invalid content';

    const schema1 = array(number(), [minLength(1), maxLength(3)]);
    const input1 = [1, 2];
    const output1 = parse(schema1, input1);
    expect(output1).toEqual(input1);
    expect(() => parse(schema1, [])).toThrowError(lengthError);
    expect(() => parse(schema1, [1, 2, 3, 4])).toThrowError(lengthError);

    const schema2 = array(number(), 'Error', [length(1), includes(123)]);
    const input2 = [123];
    const output2 = parse(schema2, input2);
    expect(output2).toEqual(input2);
    expect(() => parse(schema2, [1, 2])).toThrowError(lengthError);
    expect(() => parse(schema2, [1])).toThrowError(contentError);
  });

  test('should expose the metadata', () => {
    const schema1 = array(string(), { description: 'array value' });
    expect(schema1.metadata).toEqual({ description: 'array value' });

    const schema2 = array(string(), {
      description: 'array value',
      message: 'Value is not an array!',
    });
    expect(schema2.metadata).toEqual({ description: 'array value' });
    expect(schema2.message).toEqual('Value is not an array!');

    const schema3 = array(string());
    expect(schema3.metadata).toBeUndefined();
  });

  test('should execute pipe if output is typed', () => {
    const schema = array(string([minLength(10)]), [minLength(10)]);
    const input = ['12345'];
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
          input: input[0],
          requirement: 10,
          path: [
            {
              type: 'array',
              origin: 'value',
              input: input,
              key: 0,
              value: input[0],
            },
          ],
        },
        {
          reason: 'array',
          context: 'min_length',
          expected: '>=10',
          received: '1',
          message: 'Invalid length: Expected >=10 but received 1',
          input: input,
          requirement: 10,
        },
      ],
    } satisfies TypedSchemaResult<Output<typeof schema>>);
  });

  test('should skip pipe if output is not typed', () => {
    const schema = array(string(), [minLength(10)]);
    const input = [12345];
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
          input: input[0],
          path: [
            {
              type: 'array',
              origin: 'value',
              input: input,
              key: 0,
              value: input[0],
            },
          ],
        },
      ],
    } satisfies UntypedSchemaResult);
  });
});

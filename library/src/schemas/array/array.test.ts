import { describe, expect, test } from 'vitest';
import { type ValiError } from '../../error/index.ts';
import { parse } from '../../methods/index.ts';
import {
  maxLength,
  minLength,
  length,
  includes,
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
    const schema = array(number(), error);
    expect(() => parse(schema, 123)).toThrowError(error);
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
    const info = { abortEarly: true };
    expect(() => parse(schema, input, info)).toThrowError();
    try {
      parse(schema, input, info);
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
        input: input2,
        key: 1,
        value: input2[1],
      },
      {
        type: 'object',
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

  test('should expose the pipeline', () => {
    const schema1 = array(string(), [maxLength(5)]);
    expect(schema1.pipe).toStrictEqual([
      expect.objectContaining({
        type: 'max_length',
        requirement: 5,
        message: 'Invalid length',
      }),
    ]);

    const schema2 = array(string());
    expect(schema2.pipe).toBeUndefined();
  });
});

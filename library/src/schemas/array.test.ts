import { describe, expect, test } from 'vitest';
import { parse } from '../methods';
import { array } from './array';
import { number } from './number';
import { maxLength, minLength, length, includes } from '../validations';

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
});

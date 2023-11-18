import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { maxValue, minValue } from '../../validations/index.ts';
import { number } from './number.ts';

describe('number', () => {
  test('should pass only numbers', () => {
    const schema = number();
    const input = 123;
    const output = parse(schema, input);
    expect(output).toBe(input);
    expect(() => parse(schema, 123n)).toThrowError();
    expect(() => parse(schema, '123')).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
    expect(() => parse(schema, NaN)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not a number!';
    expect(() => parse(number(error), 'test')).toThrowError(error);
  });

  test('should execute pipe', () => {
    const valueError = 'Invalid value';

    const schema1 = number([minValue(1), maxValue(3)]);
    const input1 = 2;
    const output1 = parse(schema1, input1);
    expect(output1).toBe(input1);
    expect(() => parse(schema1, 0)).toThrowError(valueError);
    expect(() => parse(schema1, 12)).toThrowError(valueError);

    const schema2 = number('Error', [maxValue(3)]);
    const input2 = 3;
    const output2 = parse(schema2, input2);
    expect(output2).toBe(input2);
    expect(() => parse(schema2, 12346789)).toThrowError(valueError);
  });

  test('should expose the pipeline', () => {
    const schema1 = number([maxValue(5, 'custom')]);
    expect(schema1.pipe).toStrictEqual([
      expect.objectContaining({
        type: 'max_value',
        requirement: 5,
        message: 'custom',
      }),
    ]);

    const schema2 = number();
    expect(schema2.pipe).toBeUndefined();
  });
});

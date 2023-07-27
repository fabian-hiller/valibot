import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { maxValue, minValue } from '../../validations/index.ts';
import { date } from './date.ts';

describe('date', () => {
  test('should pass only dates', () => {
    const schema = date();
    const input = new Date();
    const output = parse(schema, input);
    expect(output).toEqual(input);
    expect(() => parse(schema, 2023)).toThrowError();
    expect(() => parse(schema, '2023-07-10')).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not a date!';
    expect(() => parse(date(error), 123)).toThrowError(error);
  });

  test('should execute pipe', () => {
    const valueError = 'Invalid value';

    const schema1 = date([
      minValue(new Date(Date.now() - 3600000)),
      maxValue(new Date(Date.now() + 3600000)),
    ]);
    const input1 = new Date();
    const output1 = parse(schema1, input1);
    expect(output1).toEqual(input1);
    expect(() => parse(schema1, new Date(Date.now() - 4000000))).toThrowError(
      valueError
    );
    expect(() => parse(schema1, new Date(Date.now() + 4000000))).toThrowError(
      valueError
    );

    const schema2 = date('Error', [maxValue(new Date())]);
    const input2 = new Date(Date.now() - 120000);
    const output2 = parse(schema2, input2);
    expect(output2).toEqual(input2);
    expect(() => parse(schema2, new Date(Date.now() + 1))).toThrowError(
      valueError
    );
  });
});

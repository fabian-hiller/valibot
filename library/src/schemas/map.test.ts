import { describe, expect, test } from 'vitest';
import { parse } from '../methods';
import { map } from './map';
import { string } from './string';
import { date } from './date';
import { number } from './number';
import { maxSize, minSize, size } from '../validations';

describe('map', () => {
  test('should pass only maps', () => {
    const schema1 = map(string(), date());
    const input1 = new Map().set('1', new Date());
    const output1 = parse(schema1, input1);
    expect(output1).toEqual(input1);

    const schema2 = map(number(), string());
    const input2 = new Map().set(1, '1').set(2, '2');
    const output2 = parse(schema2, input2);
    expect(output2).toEqual(input2);
    const input3 = new Map();
    const output3 = parse(schema2, input3);
    expect(output3).toEqual(input3);

    expect(() => parse(schema1, new Map().set('1', '1'))).toThrowError();
    expect(() => parse(schema1, new Map().set(1, '1'))).toThrowError();
    expect(() => parse(schema1, 123)).toThrowError();
    expect(() => parse(schema1, 'test')).toThrowError();
    expect(() => parse(schema1, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an map!';
    const schema = map(number(), string(), error);
    expect(() => parse(schema, new Set())).toThrowError(error);
  });

  test('should execute pipe', () => {
    const sizeError = 'Invalid size';

    const schema1 = map(number(), string(), [size(1)]);
    const input1 = new Map().set(1, '1');
    const output1 = parse(schema1, input1);
    expect(output1).toEqual(input1);
    expect(() => parse(schema1, new Map())).toThrowError(sizeError);
    expect(() => parse(schema1, input1.set(2, '2'))).toThrowError(sizeError);

    const schema2 = map(number(), string(), 'Error', [minSize(2), maxSize(4)]);
    const input2 = new Map().set(1, '1').set(2, '2').set(3, '3');
    const output2 = parse(schema2, input2);
    expect(output2).toEqual(input2);
    expect(() => parse(schema2, input2.set(4, '4').set(5, '5'))).toThrowError(
      sizeError
    );
    expect(() => parse(schema2, new Map().set(1, '1'))).toThrowError(sizeError);
  });
});

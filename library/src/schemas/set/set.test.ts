import { describe, expect, test } from 'vitest';
import { parse } from '../../methods';
import { maxSize, minSize, size } from '../../validations';
import { string } from '../string';
import { date } from '../date';
import { number } from '../number';
import { set } from './set';

describe('set', () => {
  test('should pass only sets', () => {
    const schema1 = set(string());
    const input1 = new Set().add('hello');
    const output1 = parse(schema1, input1);
    expect(output1).toEqual(input1);

    const schema2 = set(date());
    const input2 = new Set().add(new Date()).add(new Date());
    const output2 = parse(schema2, input2);
    expect(output2).toEqual(input2);
    const input3 = new Set();
    const output3 = parse(schema2, input3);
    expect(output3).toEqual(input3);

    expect(() => parse(schema1, new Set().add(123))).toThrowError();
    expect(() =>
      parse(schema1, new Set().add('hello').add(123))
    ).toThrowError();
    expect(() => parse(schema1, new Map())).toThrowError();
    expect(() => parse(schema1, 123)).toThrowError();
    expect(() => parse(schema1, 'test')).toThrowError();
    expect(() => parse(schema1, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an set!';
    const schema = set(number(), error);
    expect(() => parse(schema, 'test')).toThrowError(error);
  });

  test('should execute pipe', () => {
    const sizeError = 'Invalid size';

    const schema1 = set(number(), [size(1)]);
    const input1 = new Set().add(1);
    const output1 = parse(schema1, input1);
    expect(output1).toEqual(input1);
    expect(() => parse(schema1, new Set())).toThrowError(sizeError);
    expect(() => parse(schema1, input1.add(2))).toThrowError(sizeError);

    const schema2 = set(string(), 'Error', [minSize(2), maxSize(4)]);
    const input2 = new Set().add('1').add('2').add('3');
    const output2 = parse(schema2, input2);
    expect(output2).toEqual(input2);
    expect(() => parse(schema2, input2.add('4').add('5'))).toThrowError(
      sizeError
    );
    expect(() => parse(schema2, new Set().add('1'))).toThrowError(sizeError);
  });
});

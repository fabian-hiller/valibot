import { describe, expect, test } from 'vitest';
import { parse } from '../methods';
import { record } from './record';
import { number } from './number';
import { string } from './string';
import { union } from './union';
import { minLength } from '../validations';

describe('record', () => {
  test('should pass only objects', () => {
    const schema1 = record(number());
    const input1 = { key1: 1, key2: 2 };
    const output1 = parse(schema1, input1);
    expect(output1).toEqual(input1);
    expect(() => parse(schema1, { test: 'hello' })).toThrowError();
    expect(() => parse(schema1, 'test')).toThrowError();
    expect(() => parse(schema1, 123)).toThrowError();
    expect(() => parse(schema1, new Map().set('key1', '1'))).toThrowError();

    const schema2 = record(string([minLength(3)]), union([string(), number()]));
    const input2 = { 1234: 1234, test: 'hello' };
    const output2 = parse(schema2, input2);
    expect(output2).toEqual(input2);
    expect(() => parse(schema2, { a: 'test' })).toThrowError();
    expect(() => parse(schema2, { test: null })).toThrowError();
    expect(() => parse(schema2, 'test')).toThrowError();
    expect(() => parse(schema2, 123)).toThrowError();
    expect(() => parse(schema2, new Set())).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an object!';
    const schema1 = record(string(), error);
    const schema2 = record(string(), string(), error);
    expect(() => parse(schema1, 123)).toThrowError(error);
    expect(() => parse(schema2, new Date())).toThrowError(error);
  });

  test('should execute pipe', () => {
    const input = { key1: 1, key2: 1 };
    const transformInput = () => ({ key1: 2, key2: 2 });
    const output1 = parse(record(number(), [transformInput]), input);
    const output2 = parse(record(string(), number(), [transformInput]), input);
    const output3 = parse(record(number(), 'Error', [transformInput]), input);
    const output4 = parse(
      record(string(), number(), 'Error', [transformInput]),
      input
    );
    expect(output1).toEqual(transformInput());
    expect(output2).toEqual(transformInput());
    expect(output3).toEqual(transformInput());
    expect(output4).toEqual(transformInput());
  });
});

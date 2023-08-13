import { describe, expect, test } from 'vitest';
import { type ValiError } from '../../error/index.ts';
import { parse } from '../../methods/index.ts';
import { toCustom } from '../../transformations/index.ts';
import { minLength } from '../../validations/index.ts';
import { any } from '../any/index.ts';
import { number } from '../number/index.ts';
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
    const info = { abortEarly: true };

    const schema1 = record(number());
    const input1 = { 1: '1', 2: 2, 3: '3' };
    expect(() => parse(schema1, input1, info)).toThrowError();
    try {
      parse(schema1, input1, info);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
      expect((error as ValiError).issues[0].origin).toBe('value');
    }

    const schema2 = record(string([minLength(2)]), number());
    const input2 = { '1': '1', 2: 2, 3: '3' };
    expect(() => parse(schema2, input2, info)).toThrowError();
    try {
      parse(schema2, input2, info);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
      expect((error as ValiError).issues[0].origin).toBe('key');
    }
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
});

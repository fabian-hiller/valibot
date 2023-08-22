import { describe, expect, test } from 'vitest';
import { type ValiError } from '../../error/index.ts';
import { parse } from '../../methods/index.ts';
import { toCustom } from '../../transformations/index.ts';
import { number } from '../number/index.ts';
import { string } from '../string/index.ts';
import { object } from './object.ts';

describe('object', () => {
  test('should pass only objects', () => {
    const schema = object({ key1: string(), key2: number() });
    const input = { key1: 'test', key2: 123 };
    const output = parse(schema, input);
    expect(output).toEqual(input);
    expect(() => parse(schema, 'test')).toThrowError();
    expect(() => parse(schema, 123)).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
    expect(() => parse(schema, new Map())).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an object!';
    const schema = object({}, error);
    expect(() => parse(schema, 123)).toThrowError(error);
  });

  test('should throw every issue', () => {
    const schema = object({ 1: number(), 2: number(), 3: number() });
    const input = { 1: '1', 2: 2, 3: '3' };
    expect(() => parse(schema, input)).toThrowError();
    try {
      parse(schema, input);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(2);
    }
  });

  test('should throw only first issue', () => {
    const schema = object({ 1: number(), 2: number(), 3: number() });
    const input = { 1: '1', 2: 2, 3: '3' };
    const info = { abortEarly: true };
    expect(() => parse(schema, input, info)).toThrowError();
    try {
      parse(schema, input, info);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
    }
  });

  test('should return issue path', () => {
    const schema1 = object({ key: number() });
    const input1 = { key: '123' };
    const result1 = schema1._parse(input1);
    expect(result1.issues?.[0].path).toEqual([
      {
        schema: 'object',
        input: input1,
        key: 'key',
        value: input1.key,
      },
    ]);

    const schema2 = object({ nested: object({ key: string() }) });
    const input2 = { nested: { key: 123 } };
    const result2 = schema2._parse(input2);
    expect(result2.issues?.[0].path).toEqual([
      {
        schema: 'object',
        input: input2,
        key: 'nested',
        value: input2.nested,
      },
      {
        schema: 'object',
        input: input2.nested,
        key: 'key',
        value: input2.nested.key,
      },
    ]);
  });

  test('should execute pipe', () => {
    const input = { key1: '1', key2: 1 };
    const transformInput = () => ({ key1: '2', key2: 2 });
    const output1 = parse(
      object({ key1: string(), key2: number() }, [toCustom(transformInput)]),
      input
    );
    const output2 = parse(
      object({ key1: string(), key2: number() }, 'Error', [
        toCustom(transformInput),
      ]),
      input
    );
    expect(output1).toEqual(transformInput());
    expect(output2).toEqual(transformInput());
  });
});

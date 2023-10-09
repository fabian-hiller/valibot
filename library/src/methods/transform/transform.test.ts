import { describe, expect, test } from 'vitest';
import { object, string } from '../../schemas/index.ts';
import { maxValue, minValue } from '../../validations/index.ts';
import { parse } from '../parse/index.ts';
import { transform } from './transform.ts';

describe('transform', () => {
  test('should transform string to number', () => {
    const schema = transform(string(), (output) => output.length);
    const output = parse(schema, 'hello');
    expect(output).toBe(5);
  });

  test('should add key to object', () => {
    const schema = transform(object({ key1: string() }), (output) => ({
      ...output,
      key2: 'test',
    }));
    const input = { key1: 'hello' };
    const output = parse(schema, input);
    expect(output).toEqual({ ...input, key2: 'test' });
  });

  test('should return issues', () => {
    const schema = transform(string(), (output) => output.length);
    expect(() => parse(schema, 123)).toThrowError();
  });

  test('should execute pipe', () => {
    const schema = transform(string(), (output) => output.length, [
      minValue(1),
      maxValue(5),
    ]);
    const input = 'hello';
    const output = parse(schema, input);
    expect(output).toBe(input.length);
    expect(() => parse(schema, '')).toThrowError();
    expect(() => parse(schema, '123456')).toThrowError();
  });
});

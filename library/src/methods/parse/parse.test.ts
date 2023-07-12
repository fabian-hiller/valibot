import { describe, expect, test } from 'vitest';
import { number, object, string } from '../../schemas';
import { parse } from './parse';

describe('parse', () => {
  test('should parse schema', () => {
    const output1 = parse(string(), 'hello');
    expect(output1).toBe('hello');
    const output2 = parse(number(), 123);
    expect(output2).toBe(123);
    const output3 = parse(object({ test: string() }), { test: 'hello' });
    expect(output3).toEqual({ test: 'hello' });
  });

  test('should throw error', () => {
    expect(() => parse(string(), 123)).toThrowError('Invalid type');
    expect(() => parse(number(), 'hello')).toThrowError('Invalid type');
    const objectSchema = object({ test: string() });
    expect(() => parse(objectSchema, {})).toThrowError('Invalid type');
  });
});

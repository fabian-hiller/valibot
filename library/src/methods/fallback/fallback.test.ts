import { describe, expect, test } from 'vitest';
import { object, string } from '../../schemas/index.ts';
import { parse } from '../parse/index.ts';
import { fallback } from './fallback.ts';

describe('fallback', () => {
  const schema1 = fallback(string(), 'test');
  const schema2 = fallback(string(), () => 'test');
  const schema3 = object({ key1: schema1, key2: schema2 });

  test('should use default value', () => {
    const output1 = parse(schema1, 123);
    expect(output1).toBe('test');
    const output2 = parse(schema2, 123);
    expect(output2).toBe('test');
    const output3 = parse(schema3, {});
    expect(output3).toEqual({ key1: 'test', key2: 'test' });
  });

  test('should not use default value', () => {
    const input1 = 'hello';
    const output1 = parse(schema1, input1);
    expect(output1).toBe(input1);
    const output2 = parse(schema2, input1);
    expect(output2).toBe(input1);
    const input2 = { key1: 'hello', key2: 'hello' };
    const output3 = parse(schema3, input2);
    expect(output3).toEqual(input2);
  });
});

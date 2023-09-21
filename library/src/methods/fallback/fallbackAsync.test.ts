import { describe, expect, test } from 'vitest';
import { objectAsync, string, stringAsync } from '../../schemas/index.ts';
import { parseAsync } from '../parse/index.ts';
import { fallbackAsync } from './fallbackAsync.ts';

describe('fallbackAsync', () => {
  const schema1 = fallbackAsync(stringAsync(), 'test');
  const schema2 = fallbackAsync(string(), () => 'test');
  const schema3 = objectAsync({ key1: schema1, key2: schema2 });

  test('should use default value', async () => {
    const output1 = await parseAsync(schema1, 123);
    expect(output1).toBe('test');
    const output2 = await parseAsync(schema2, 123);
    expect(output2).toBe('test');
    const output3 = await parseAsync(schema3, {});
    expect(output3).toEqual({ key1: 'test', key2: 'test' });
  });

  test('should not use default value', async () => {
    const input1 = 'hello';
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toBe(input1);
    const output2 = await parseAsync(schema2, input1);
    expect(output2).toBe(input1);
    const input2 = { key1: 'hello', key2: 'hello' };
    const output3 = await parseAsync(schema3, input2);
    expect(output3).toEqual(input2);
  });

  test('should have fallback property', () => {
    expect(schema1.fallback).toEqual('test');
    expect(schema2.fallback).toEqual('test');
  });
});

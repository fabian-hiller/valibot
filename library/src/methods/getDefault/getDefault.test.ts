import { describe, expect, test } from 'vitest'
import { number, object, record, string } from '../../schemas/index.ts'
import { withDefault } from '../withDefault/index.ts'
import { getDefault } from './getDefault.ts'

describe('getDefault', () => {
  test('should get default value for simple schema', () => {
    const schema1 = withDefault(string(), 'test');
    const output1 = getDefault(schema1);
    expect(output1).toBe('test');

    const schema2 = withDefault(number(), 42);
    const output2 = getDefault(schema2);
    expect(output2).toBe(42);

    const schema3 = withDefault(number(), () => 42);
    const output3 = getDefault(schema3);
    expect(output3).toBe(42);
  });

  test('should get default value for nested schema', () => {
    const schema2 = object({ test: withDefault(string(), 'test') });
    const output3 = getDefault(schema2);
    expect(output3).toStrictEqual({ test: 'test' });
  });

  test('should work with extra properties', () => {
    const schema2 = object({ test: withDefault(string(), 'test'), extra: string() });
    const output3 = getDefault(schema2);
    expect(output3).toStrictEqual({ test: 'test', extra: undefined });
  });

  test('should work with functions as default', () => {
    const schema2 = withDefault(record(string(), string()), () => ({ test: 'test' }));
    const output3 = getDefault(schema2);
    expect(output3).toStrictEqual({ test: 'test' });
  });
});

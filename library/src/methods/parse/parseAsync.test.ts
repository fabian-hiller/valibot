import { describe, expect, test } from 'vitest';
import { numberAsync, object, string } from '../../schemas';
import { parseAsync } from './parseAsync';

describe('parseAsync', () => {
  test('should parse schema', async () => {
    const output1 = await parseAsync(string(), 'hello');
    expect(output1).toBe('hello');
    const output2 = await parseAsync(numberAsync(), 123);
    expect(output2).toBe(123);
    const output3 = await parseAsync(object({ test: string() }), {
      test: 'hello',
    });
    expect(output3).toEqual({ test: 'hello' });
  });

  test('should throw error', async () => {
    await expect(parseAsync(string(), 123)).rejects.toThrowError(
      'Invalid type'
    );
    await expect(parseAsync(numberAsync(), 'hello')).rejects.toThrowError(
      'Invalid type'
    );
    const objectSchema = object({ test: string() });
    await expect(parseAsync(objectSchema, {})).rejects.toThrowError(
      'Invalid type'
    );
  });
});

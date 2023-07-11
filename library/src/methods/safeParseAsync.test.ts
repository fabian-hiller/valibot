import { describe, expect, test } from 'vitest';
import { safeParseAsync } from './safeParseAsync';
import { number, objectAsync, string } from '../schemas';
import { ValiError } from '../error';

describe('safeParseAsync', () => {
  test('should return data', async () => {
    const output1 = await safeParseAsync(string(), 'hello');
    expect(output1).toEqual({
      success: true,
      data: 'hello',
    });
    const output2 = await safeParseAsync(number(), 123);
    expect(output2).toEqual({
      success: true,
      data: 123,
    });
    const output3 = await safeParseAsync(objectAsync({ test: string() }), {
      test: 'hello',
    });
    expect(output3).toEqual({
      success: true,
      data: { test: 'hello' },
    });
  });

  test('should return error', async () => {
    const output1 = await safeParseAsync(string(), 123);
    expect(output1.success).toBe(false);
    if (!output1.success) {
      expect(output1.error).toBeInstanceOf(ValiError);
      expect(output1.error.message).toBe('Invalid type');
    }
    const output2 = await safeParseAsync(number(), 'hello');
    expect(output2.success).toBe(false);
    if (!output2.success) {
      expect(output2.error).toBeInstanceOf(ValiError);
      expect(output2.error.message).toBe('Invalid type');
    }
    const output3 = await safeParseAsync(objectAsync({ test: string() }), {});
    expect(output3.success).toBe(false);
    if (!output3.success) {
      expect(output3.error).toBeInstanceOf(ValiError);
      expect(output3.error.message).toBe('Invalid type');
    }
  });
});

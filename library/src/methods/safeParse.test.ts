import { describe, expect, test } from 'vitest';
import { safeParse } from './safeParse';
import { number, object, string } from '../schemas';
import { ValiError } from '../error';

describe('safeParse', () => {
  test('should return data', () => {
    const output1 = safeParse(string(), 'hello');
    expect(output1).toEqual({
      success: true,
      data: 'hello',
    });
    const output2 = safeParse(number(), 123);
    expect(output2).toEqual({
      success: true,
      data: 123,
    });
    const output3 = safeParse(object({ test: string() }), { test: 'hello' });
    expect(output3).toEqual({
      success: true,
      data: { test: 'hello' },
    });
  });

  test('should return error', () => {
    const output1 = safeParse(string(), 123);
    expect(output1.success).toBe(false);
    if (!output1.success) {
      expect(output1.error).toBeInstanceOf(ValiError);
      expect(output1.error.message).toBe('Invalid type');
    }
    const output2 = safeParse(number(), 'hello');
    expect(output2.success).toBe(false);
    if (!output2.success) {
      expect(output2.error).toBeInstanceOf(ValiError);
      expect(output2.error.message).toBe('Invalid type');
    }
    const output3 = safeParse(object({ test: string() }), {});
    expect(output3.success).toBe(false);
    if (!output3.success) {
      expect(output3.error).toBeInstanceOf(ValiError);
      expect(output3.error.message).toBe('Invalid type');
    }
  });
});

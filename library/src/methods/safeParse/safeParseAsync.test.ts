import { describe, expect, test } from 'vitest';
import { number, objectAsync, string } from '../../schemas/index.ts';
import { safeParseAsync } from './safeParseAsync.ts';

describe('safeParseAsync', () => {
  test('should return data', async () => {
    const output1 = await safeParseAsync(string(), 'hello');
    expect(output1).toEqual({
      success: true,
      data: 'hello',
      output: 'hello',
    });
    const output2 = await safeParseAsync(number(), 123);
    expect(output2).toEqual({
      success: true,
      data: 123,
      output: 123,
    });
    const output3 = await safeParseAsync(objectAsync({ test: string() }), {
      test: 'hello',
    });
    expect(output3).toEqual({
      success: true,
      data: { test: 'hello' },
      output: { test: 'hello' },
    });
  });

  test('should return error', async () => {
    const output1 = await safeParseAsync(string(), 123);
    expect(output1.success).toBe(false);
    if (!output1.success) {
      expect(output1.issues).toBeTruthy();
      expect(output1.issues[0].message).toBe('Invalid type');
    }
    const output2 = await safeParseAsync(number(), 'hello');
    expect(output2.success).toBe(false);
    if (!output2.success) {
      expect(output2.issues).toBeTruthy();
      expect(output2.issues[0].message).toBe('Invalid type');
    }
    const output3 = await safeParseAsync(objectAsync({ test: string() }), {});
    expect(output3.success).toBe(false);
    if (!output3.success) {
      expect(output3.issues).toBeTruthy();
      expect(output3.issues[0].message).toBe('Invalid type');
    }
  });
});

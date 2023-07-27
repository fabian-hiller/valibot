import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { string } from '../string/index.ts';
import { nullableAsync } from './nullableAsync.ts';

describe('nullableAsync', () => {
  test('should pass also null', async () => {
    const schema = nullableAsync(string());
    const input = 'test';
    const output = await parseAsync(schema, input);
    expect(output).toBe(input);
    expect(await parseAsync(schema, null)).toBeNull();
    await expect(parseAsync(schema, 123)).rejects.toThrowError();
    await expect(parseAsync(schema, false)).rejects.toThrowError();
    await expect(parseAsync(schema, undefined)).rejects.toThrowError();
    await expect(parseAsync(schema, {})).rejects.toThrowError();
  });
});

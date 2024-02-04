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

  test('should use default if required', async () => {
    const default_ = 'default';
    const input = 'test';

    const schema1 = nullableAsync(string(), default_);
    expect(await parseAsync(schema1, input)).toBe(input);
    expect(await parseAsync(schema1, null)).toBe(default_);

    const schema2 = nullableAsync(string(), () => default_);
    expect(await parseAsync(schema2, input)).toBe(input);
    expect(await parseAsync(schema2, null)).toBe(default_);
  });

  test('should expose the metadata', () => {
    const schema1 = nullableAsync(string({ description: 'nullable string' }));
    expect(schema1.metadata).toEqual({ description: 'nullable string' });
  });
});

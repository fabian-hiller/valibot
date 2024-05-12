import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { string } from '../string/index.ts';
import { optionalAsync } from './optionalAsync.ts';

describe('optionalAsync', () => {
  test('should pass also undefined', async () => {
    const schema = optionalAsync(string());
    const input = 'test';
    const output = await parseAsync(schema, input);
    expect(output).toBe(input);
    expect(await parseAsync(schema, undefined)).toBeUndefined();

    await expect(parseAsync(schema, 123)).rejects.toThrowError();
    await expect(parseAsync(schema, false)).rejects.toThrowError();
    await expect(parseAsync(schema, null)).rejects.toThrowError();
    await expect(parseAsync(schema, {})).rejects.toThrowError();
  });

  test('should use default if required', async () => {
    const default_ = 'default';
    const input = 'test';

    const schema1 = optionalAsync(string(), default_);
    expect(await parseAsync(schema1, input)).toBe(input);
    expect(await parseAsync(schema1, undefined)).toBe(default_);

    const schema2 = optionalAsync(string(), () => default_);
    expect(await parseAsync(schema2, input)).toBe(input);
    expect(await parseAsync(schema2, undefined)).toBe(default_);
  });

  test('should expose the metadata', () => {
    const schema1 = optionalAsync(string({ description: 'optional string' }));
    expect(schema1.metadata).toEqual({ description: 'optional string' });
  });
});

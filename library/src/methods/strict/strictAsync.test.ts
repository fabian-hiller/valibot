import { describe, expect, test } from 'vitest';
import {number, objectAsync, optionalAsync, string} from '../../schemas/index.ts';
import { parseAsync } from '../parse/index.ts';
import { strictAsync } from './strictAsync.ts';

describe('strict', () => {
  test('should detect unknown keys', async () => {
    const schema = strictAsync(objectAsync({ key1: string(), key2: number() }));

    const input1 = { key1: 'test', key2: 123 };
    const output1 = await parseAsync(schema, input1);
    expect(output1).toEqual(input1);

    const keysError = 'Invalid keys';
    const input2 = { key1: 'test', key2: 123, key3: 'unknown' };
    await expect(parseAsync(schema, input2)).rejects.toThrowError(keysError);
    const input3 = { key1: 'test', key2: 123, key3: 'unknown', key4: 123 };
    await expect(parseAsync(schema, input3)).rejects.toThrowError(keysError);
  });

  test('should not fail on optional properties', async () => {
    const schema = strictAsync(objectAsync({ key1: string(), key2: optionalAsync(number()) }));

    const input1 = { key1: 'test' };
    const output1 = await parseAsync(schema, input1);
    expect(output1).toEqual(input1);

    const keysError = 'Invalid keys';
    const input2 = { key1: 'test', key3: 'unknown' };
    await expect(parseAsync(schema, input2)).rejects.toThrowError(keysError);
    const input3 = { key1: 'test', key3: 'unknown', key4: 123 };
    await expect(parseAsync(schema, input3)).rejects.toThrowError(keysError);
  });
});

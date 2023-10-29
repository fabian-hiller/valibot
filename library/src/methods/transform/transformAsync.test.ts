import { describe, expect, test } from 'vitest';
import { object, string } from '../../schemas/index.ts';
import { maxValue, minValue } from '../../validations/index.ts';
import { parseAsync } from '../parse/index.ts';
import { transformAsync } from './transformAsync.ts';

describe('transformAsync', () => {
  test('should transform string to number', async () => {
    const schema = transformAsync(string(), (output) => output.length);
    const output = await parseAsync(schema, 'hello');
    expect(output).toBe(5);
  });

  test('should add key to object', async () => {
    const schema = transformAsync(object({ key1: string() }), (output) => ({
      ...output,
      key2: 'test',
    }));
    const input = { key1: 'hello' };
    const output = await parseAsync(schema, input);
    expect(output).toEqual({ ...input, key2: 'test' });
  });

  test('should return issues', async () => {
    const schema = transformAsync(string(), (output) => output.length);
    await expect(parseAsync(schema, 123)).rejects.toThrowError();
  });

  test('should execute pipe', async () => {
    const schema = transformAsync(string(), (output) => output.length, [
      minValue(1),
      maxValue(5),
    ]);
    const input = 'hello';
    const output = await parseAsync(schema, input);
    expect(output).toBe(input.length);
    await expect(parseAsync(schema, '')).rejects.toThrowError();
    await expect(parseAsync(schema, '123456')).rejects.toThrowError();
  });
});

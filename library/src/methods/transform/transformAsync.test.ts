import { describe, expect, test } from 'vitest';
import { object, string } from '../../schemas';
import { parseAsync } from '../parse';
import { transformAsync } from './transformAsync';

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
});

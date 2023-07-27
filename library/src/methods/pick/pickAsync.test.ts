import { describe, expect, test } from 'vitest';
import { comparable } from '../../comparable.ts';
import { object, objectAsync, string } from '../../schemas/index.ts';
import { parseAsync } from '../parse/index.ts';
import { pickAsync } from './pickAsync.ts';

describe('pickAsync', () => {
  test('should pick two object keys', async () => {
    const schema = pickAsync(
      object({ key1: string(), key2: string(), key3: string() }),
      ['key1', 'key3']
    );
    expect(schema).toEqual(
      comparable(objectAsync({ key1: string(), key3: string() }))
    );
    const input = { key1: 'test', key3: 'test' };
    const output = await parseAsync(schema, input);
    expect(output).toEqual(input);
    await expect(
      parseAsync(schema, { key1: 'test', key2: 'test' })
    ).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not an object!';
    const schema = pickAsync(
      objectAsync({ key1: string(), key2: string() }),
      ['key1'],
      error
    );
    await expect(parseAsync(schema, 123)).rejects.toThrowError(error);
  });

  test('should execute pipe', async () => {
    const input = { key1: '1' };
    const transformInput = () => ({ key1: '2' });
    const output1 = await parseAsync(
      pickAsync(
        object({ key1: string(), key2: string() }),
        ['key1'],
        [transformInput]
      ),
      input
    );
    const output2 = await parseAsync(
      pickAsync(object({ key1: string(), key2: string() }), ['key1'], 'Error', [
        transformInput,
      ]),
      input
    );
    expect(output1).toEqual(transformInput());
    expect(output2).toEqual(transformInput());
  });
});

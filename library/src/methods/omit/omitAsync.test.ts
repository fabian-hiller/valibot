import { describe, expect, test } from 'vitest';
import { comparable } from '../../comparable.ts';
import { object, objectAsync, string } from '../../schemas/index.ts';
import { toCustom } from '../../transformations/index.ts';
import { parseAsync } from '../parse/index.ts';
import { omitAsync } from './omitAsync.ts';

describe('omitAsync', () => {
  test('should omit two object keys', async () => {
    const schema = omitAsync(
      objectAsync({ key1: string(), key2: string(), key3: string() }),
      ['key1', 'key3']
    );
    expect(schema).toEqual(comparable(objectAsync({ key2: string() })));
    const input = { key2: 'test' };
    const output = await parseAsync(schema, input);
    expect(output).toEqual(input);
    await expect(parseAsync(schema, { key1: 'test' })).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not an object!';
    const schema = omitAsync(
      object({ key1: string(), key2: string() }),
      ['key1'],
      error
    );
    await expect(parseAsync(schema, 123)).rejects.toThrowError(error);
  });

  test('should execute pipe', async () => {
    const input = { key2: '1' };
    const transformInput = () => ({ key2: '2' });
    const output1 = await parseAsync(
      omitAsync(
        objectAsync({ key1: string(), key2: string() }),
        ['key1'],
        [toCustom(transformInput)]
      ),
      input
    );
    const output2 = await parseAsync(
      omitAsync(object({ key1: string(), key2: string() }), ['key1'], 'Error', [
        toCustom(transformInput),
      ]),
      input
    );
    expect(output1).toEqual(transformInput());
    expect(output2).toEqual(transformInput());
  });

  test('should expose the metadata', async () => {
    const schema1 = omitAsync(
      object({ key1: string(), key2: string(), key3: string() }),
      ['key1', 'key3'],
      { description: 'a simple object' }
    );
    expect(schema1.metadata).toEqual({ description: 'a simple object' });

    const schema2 = omitAsync(
      object({ key1: string(), key2: string(), key3: string() }),
      ['key1', 'key3'],
      string(),
      { description: 'an object with a rest' }
    );
    expect(schema2.metadata).toEqual({ description: 'an object with a rest' });

    const schema3 = omitAsync(
      object({ key1: string(), key2: string(), key3: string() }),
      ['key1', 'key3'],
      { description: 'a simple object', message: 'Value is not an object!' }
    );
    expect(schema3.metadata).toEqual({ description: 'a simple object' });
    expect(schema3.message).toEqual('Value is not an object!');
  });
});

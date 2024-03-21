import { describe, expect, test } from 'vitest';
import { comparable } from '../../comparable.ts';
import {
  object,
  objectAsync,
  optionalAsync,
  string,
} from '../../schemas/index.ts';
import { toCustom } from '../../transformations/index.ts';
import { parseAsync } from '../parse/index.ts';
import { partialAsync } from './partialAsync.ts';

describe('partialAsync', () => {
  test('should have optional keys', async () => {
    const schema = partialAsync(
      objectAsync({ key1: string(), key2: string() })
    );
    expect(schema).toEqual(
      comparable(
        objectAsync({
          key1: optionalAsync(string()),
          key2: optionalAsync(string()),
        })
      )
    );
    const input = { key1: 'test' };
    const output = await parseAsync(schema, input);
    expect(output).toEqual(input);
  });

  test('should throw custom error', async () => {
    const error = 'Value is not an object!';
    const schema = partialAsync(
      object({ key1: string(), key2: string() }),
      error
    );
    await expect(parseAsync(schema, 123)).rejects.toThrowError(error);
  });

  test('should execute pipe', async () => {
    const input = {};
    const transformInput = (): { key1?: string } => ({ key1: '1' });
    const output1 = await parseAsync(
      partialAsync(object({ key1: string() }), [toCustom(transformInput)]),
      input
    );
    const output2 = await parseAsync(
      partialAsync(object({ key1: string() }), 'Error', [
        toCustom(transformInput),
      ]),
      input
    );
    expect(output1).toEqual(transformInput());
    expect(output2).toEqual(transformInput());
  });

  test('should expose the metadata', async () => {
    const schema1 = partialAsync(
      object({ key1: string(), key2: string(), key3: string() }),
      { description: 'a simple object' }
    );
    expect(schema1.metadata).toEqual({ description: 'a simple object' });

    const schema2 = partialAsync(
      object({ key1: string(), key2: string(), key3: string() }),
      { description: 'a simple object', message: 'Value is not an object!' }
    );
    expect(schema2.metadata).toEqual({ description: 'a simple object' });
    expect(schema2.message).toEqual('Value is not an object!');
  });
});

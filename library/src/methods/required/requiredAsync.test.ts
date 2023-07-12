import { describe, expect, test } from 'vitest';
import { comparable } from '../../utils';
import {
  nonOptionalAsync,
  object,
  objectAsync,
  optionalAsync,
  string,
} from '../../schemas';
import { parseAsync } from '../parse';
import { requiredAsync } from './requiredAsync';

describe('requiredAsync', () => {
  test('should have non optional keys', async () => {
    const schema = requiredAsync(
      objectAsync({ key1: optionalAsync(string()), key2: string() })
    );
    expect(schema).toEqual(
      comparable(
        objectAsync({
          key1: nonOptionalAsync(optionalAsync(string())),
          key2: nonOptionalAsync(string()),
        })
      )
    );
    const input = { key1: 'test', key2: 'test' };
    const output = await parseAsync(schema, input);
    expect(output).toEqual(input);
    expect(parseAsync(schema, { key2: 'test' })).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not an object!';
    const schema = requiredAsync(
      object({ key1: string(), key2: string() }),
      error
    );
    await expect(parseAsync(schema, 123)).rejects.toThrowError(error);
  });

  test('should execute pipe', async () => {
    const input = { key1: '1' };
    const transformInput = () => ({ key1: '2' });
    const output1 = await parseAsync(
      requiredAsync(object({ key1: string() }), [transformInput]),
      input
    );
    const output2 = await parseAsync(
      requiredAsync(object({ key1: string() }), 'Error', [transformInput]),
      input
    );
    expect(output1).toEqual(transformInput());
    expect(output2).toEqual(transformInput());
  });
});

import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods';
import { number } from '../number';
import { string, stringAsync } from '../string';
import { objectAsync } from '../object';
import { optional } from '../optional';
import { passthroughAsync } from './passthroughAsync';
import { o } from 'vitest/dist/types-198fd1d9';

describe('passthroughAsync', () => {
  test('should pass only objects', async () => {
    const schema = passthroughAsync(
      objectAsync({ key1: stringAsync(), key2: number() })
    );
    const input = { key1: 'test', key2: 123 };
    const output = await parseAsync(schema, input);
    expect(output).toEqual(input);
    await expect(parseAsync(schema, 'test')).rejects.toThrowError();
    await expect(parseAsync(schema, 123)).rejects.toThrowError();
    await expect(parseAsync(schema, {})).rejects.toThrowError();
    await expect(parseAsync(schema, undefined)).rejects.toThrowError();
    await expect(parseAsync(schema, null)).rejects.toThrowError();
    await expect(parseAsync(schema, 'test')).rejects.toThrowError();
    await expect(parseAsync(schema, 123)).rejects.toThrowError();
    await expect(parseAsync(schema, { key1: 'test' })).rejects.toThrowError();
    await expect(
      parseAsync(schema, { key1: '', key2: '123' })
    ).rejects.toThrowError();
    await expect(
      parseAsync(schema, { key1: true, key2: 123 })
    ).rejects.toThrowError();
  });

  test('should keep extra props', async () => {
    const schema = passthroughAsync(
      objectAsync({ key1: stringAsync(), key2: optional(number()) })
    );
    const input = {
      key1: 'test',
      key2: 123,
      key3: true,
      key4() {
        console.log('keep function');
      },
    };
    const output = await parseAsync(schema, input);
    expect(output).toEqual(input);
    expect(output.key3).toBeTruthy();
    expect(output.key4).toBe(input.key4);
    await expect(parseAsync(schema, undefined)).rejects.toThrowError();
    await expect(parseAsync(schema, 123)).rejects.toThrowError();
    await expect(parseAsync(schema, false)).rejects.toThrowError();
    await expect(parseAsync(schema, null)).rejects.toThrowError();
    await expect(parseAsync(schema, {})).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not an object!';
    const schema = passthroughAsync(objectAsync({}, error));
    await expect(parseAsync(schema, 123)).rejects.toThrowError(error);
    await expect(parseAsync(schema, null)).rejects.toThrowError(error);
    await expect(parseAsync(schema, undefined)).rejects.toThrowError(error);
  });

  test('should execute pipe', async () => {
    const transformInput = () => ({ key1: '3', key2: 456 });
    const schema = passthroughAsync(
      objectAsync({ key1: string(), key2: number() }, [transformInput])
    );
    const input1 = { key1: '1', key2: 2 };
    const output1 = await parseAsync(schema, input1);
    expect(output1).toEqual(transformInput());
    const input2 = { key1: '1', key2: 2, key3: true };
    const output2 = await parseAsync(schema, input2);
    expect(output2).toEqual({ key1: '3', key2: 456, key3: true });
  });
});

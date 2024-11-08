import { describe, expect, test } from 'vitest';
import {
  boolean,
  number,
  string,
  tupleWithRestAsync,
} from '../../schemas/index.ts';
import { type ArgsActionAsync, argsAsync } from './argsAsync.ts';

describe('argsAsync', () => {
  type Input = (...args: unknown[]) => Promise<number>;
  const schema = tupleWithRestAsync([string(), number()], boolean());
  type Schema = typeof schema;
  const action = argsAsync(schema);

  test('should return action object', () => {
    expect(action).toStrictEqual({
      kind: 'transformation',
      type: 'args',
      reference: argsAsync,
      async: false,
      schema,
      '~run': expect.any(Function),
    } satisfies ArgsActionAsync<Input, Schema>);
  });

  const func = async () => 123;
  const dataset = action['~run']({ typed: true, value: func }, {});

  test('should return new function', () => {
    expect(dataset).toStrictEqual({
      typed: true,
      value: expect.any(Function),
    });
    expect(dataset.value).not.toBe(func);
  });

  test('should not throw error for valid args', async () => {
    if (dataset.typed) {
      await expect(dataset.value('foo', 123)).resolves.not.toThrowError();
      await expect(dataset.value('foo', 123, true)).resolves.not.toThrowError();
      await expect(
        dataset.value('foo', 123, true, false)
      ).resolves.not.toThrowError();
      await expect(
        dataset.value('foo', 123, true, false, true)
      ).resolves.not.toThrowError();
    }
  });

  test('should throw error for invalid args', async () => {
    if (dataset.typed) {
      // @ts-expect-error
      await expect(dataset.value()).rejects.toThrowError();
      // @ts-expect-error
      await expect(dataset.value('foo')).rejects.toThrowError();
      // @ts-expect-error
      await expect(dataset.value(null, 123)).rejects.toThrowError();
      // @ts-expect-error
      await expect(dataset.value('foo', null)).rejects.toThrowError();
      // @ts-expect-error
      await expect(dataset.value(123, 'foo')).rejects.toThrowError();
      await expect(
        // @ts-expect-error
        dataset.value('foo', 123, null)
      ).rejects.toThrowError();
    }
  });
});

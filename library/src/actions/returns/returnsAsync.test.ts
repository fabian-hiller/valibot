import { describe, expect, test } from 'vitest';
import { pipeAsync } from '../../methods/index.ts';
import { number } from '../../schemas/index.ts';
import { minValue } from '../minValue/index.ts';
import { type ReturnsActionAsync, returnsAsync } from './returnsAsync.ts';

describe('returnsAsync', () => {
  type Input = (arg1: unknown) => Promise<unknown>;
  const schema = pipeAsync(number(), minValue(0));
  type Schema = typeof schema;
  const action = returnsAsync(schema);

  test('should return action object', () => {
    expect(action).toStrictEqual({
      kind: 'transformation',
      type: 'returns',
      reference: returnsAsync,
      async: false,
      schema,
      '~run': expect.any(Function),
    } satisfies ReturnsActionAsync<Input, Schema>);
  });

  const func = async (arg1: unknown) => arg1;
  const dataset = action['~run']({ typed: true, value: func }, {});

  test('should return new function', () => {
    expect(dataset).toStrictEqual({
      typed: true,
      value: expect.any(Function),
    });
    expect(dataset.value).not.toBe(func);
  });

  test('should not throw error for valid returnsAsync', async () => {
    if (dataset.typed) {
      await expect(dataset.value(123)).resolves.not.toThrowError();
      expect(await dataset.value(123)).toBe(123);
    }
  });

  test('should throw error for invalid returnsAsync', async () => {
    if (dataset.typed) {
      await expect(dataset.value(-123)).rejects.toThrowError();
      await expect(dataset.value('123')).rejects.toThrowError();
      await expect(dataset.value(123n)).rejects.toThrowError();
      await expect(dataset.value(null)).rejects.toThrowError();
    }
  });
});

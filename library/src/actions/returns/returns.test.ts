import { describe, expect, test } from 'vitest';
import { number } from '../../schemas/index.ts';
import { returns, type ReturnsAction } from './returns.ts';

describe('returns', () => {
  type Input = (arg1: unknown) => unknown;
  const schema = number();
  type Schema = typeof schema;
  const action = returns(schema);

  test('should return action object', () => {
    expect(action).toStrictEqual({
      kind: 'transformation',
      type: 'returns',
      reference: returns,
      async: false,
      schema,
      '~run': expect.any(Function),
    } satisfies ReturnsAction<Input, Schema>);
  });

  const func = (arg1: unknown) => arg1;
  const dataset = action['~run']({ typed: true, value: func }, {});

  test('should return new function', () => {
    expect(dataset).toStrictEqual({
      typed: true,
      value: expect.any(Function),
    });
    expect(dataset.value).not.toBe(func);
  });

  test('should not throw error for valid returns', () => {
    if (dataset.typed) {
      expect(() => dataset.value(123)).not.toThrowError();
      expect(dataset.value(123)).toBe(123);
    }
  });

  test('should throw error for invalid returns', () => {
    if (dataset.typed) {
      expect(() => dataset.value('123')).toThrowError();
      expect(() => dataset.value(123n)).toThrowError();
      expect(() => dataset.value(null)).toThrowError();
    }
  });
});

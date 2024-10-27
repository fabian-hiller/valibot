import { describe, expect, test } from 'vitest';
import { transform, type TransformAction } from './transform.ts';

describe('transform', () => {
  test('should return action object', () => {
    const operation = (input: string) => input.length;
    const action = transform(operation);
    expect(action).toStrictEqual({
      kind: 'transformation',
      type: 'transform',
      reference: transform,
      async: false,
      operation,
      '~validate': expect.any(Function),
    } satisfies TransformAction<string, number>);
  });

  describe('should transform input', () => {
    test('to length of string', () => {
      const action = transform((input: string) => input.length);
      expect(
        action['~validate']({ typed: true, value: '123456' }, {})
      ).toStrictEqual({
        typed: true,
        value: 6,
      });
    });

    test('to object with new key', () => {
      const action = transform((input: { key1: string }) => ({
        ...input,
        key2: 123,
      }));
      expect(
        action['~validate']({ typed: true, value: { key1: 'foo' } }, {})
      ).toStrictEqual({
        typed: true,
        value: { key1: 'foo', key2: 123 },
      });
    });
  });
});

import { describe, expect, test } from 'vitest';
import { transform, type TransformAction } from './transform.ts';

describe('transform', () => {
  test('should return action object', () => {
    const action = transform((input: string) => input.length);
    expect(action).toStrictEqual({
      kind: 'transformation',
      type: 'transform',
      reference: transform,
      async: false,
      action: action.action,
      _run: expect.any(Function),
    } satisfies TransformAction<string, number>);
  });

  describe('should transform input', () => {
    test('to length of string', () => {
      const action = transform((input: string) => input.length);
      expect(action._run({ typed: true, value: '123456' }, {})).toStrictEqual({
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
        action._run({ typed: true, value: { key1: 'foo' } }, {})
      ).toStrictEqual({
        typed: true,
        value: { key1: 'foo', key2: 123 },
      });
    });
  });
});

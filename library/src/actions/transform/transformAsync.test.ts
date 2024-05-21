import { describe, expect, test } from 'vitest';
import { type TransformActionAsync, transformAsync } from './transformAsync.ts';

describe('transformAsync', () => {
  test('should return action object', () => {
    const action = transformAsync(async (input: string) => input.length);
    expect(action).toStrictEqual({
      kind: 'transformation',
      type: 'transform',
      reference: transformAsync,
      async: true,
      action: action.action,
      _run: expect.any(Function),
    } satisfies TransformActionAsync<string, number>);
  });

  describe('should transformAsync input', () => {
    test('to length of string', async () => {
      const action = transformAsync(async (input: string) => input.length);
      expect(
        await action._run({ typed: true, value: '123456' }, {})
      ).toStrictEqual({
        typed: true,
        value: 6,
      });
    });

    test('to object with new key', async () => {
      const action = transformAsync(async (input: { key1: string }) => ({
        ...input,
        key2: 123,
      }));
      expect(
        await action._run({ typed: true, value: { key1: 'foo' } }, {})
      ).toStrictEqual({
        typed: true,
        value: { key1: 'foo', key2: 123 },
      });
    });
  });
});

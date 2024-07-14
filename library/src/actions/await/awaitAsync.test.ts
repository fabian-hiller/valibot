import { describe, expect, test } from 'vitest';
import { type AwaitActionAsync, awaitAsync } from './awaitAsync.ts';

describe('awaitAsync', () => {
  type Input = Promise<string>;
  const action = awaitAsync<Input>();

  test('should return action object', () => {
    expect(action).toStrictEqual({
      kind: 'transformation',
      type: 'await',
      reference: awaitAsync,
      async: true,
      _run: expect.any(Function),
    } satisfies AwaitActionAsync<Input>);
  });

  test('should await promise', async () => {
    expect(
      await action._run({ typed: true, value: Promise.resolve('foo') }, {})
    ).toStrictEqual({
      typed: true,
      value: 'foo',
    });
  });
});

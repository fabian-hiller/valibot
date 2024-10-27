import { describe, expect, test } from 'vitest';
import { boolean, number, string, tupleWithRest } from '../../schemas/index.ts';
import { args, type ArgsAction } from './args.ts';

describe('args', () => {
  type Input = (...args: unknown[]) => number;
  const schema = tupleWithRest([string(), number()], boolean());
  type Schema = typeof schema;
  const action = args(schema);

  test('should return action object', () => {
    expect(action).toStrictEqual({
      kind: 'transformation',
      type: 'args',
      reference: args,
      async: false,
      schema,
      '~validate': expect.any(Function),
    } satisfies ArgsAction<Input, Schema>);
  });

  const func = () => 123;
  const dataset = action['~validate']({ typed: true, value: func }, {});

  test('should return new function', () => {
    expect(dataset).toStrictEqual({
      typed: true,
      value: expect.any(Function),
    });
    expect(dataset.value).not.toBe(func);
  });

  test('should not throw error for valid args', () => {
    if (dataset.typed) {
      expect(() => dataset.value('foo', 123)).not.toThrowError();
      expect(() => dataset.value('foo', 123, true)).not.toThrowError();
      expect(() => dataset.value('foo', 123, true, false)).not.toThrowError();
      expect(() =>
        dataset.value('foo', 123, true, false, true)
      ).not.toThrowError();
    }
  });

  test('should throw error for invalid args', () => {
    if (dataset.typed) {
      // @ts-expect-error
      expect(() => dataset.value()).toThrowError();
      // @ts-expect-error
      expect(() => dataset.value('foo')).toThrowError();
      // @ts-expect-error
      expect(() => dataset.value(null, 123)).toThrowError();
      // @ts-expect-error
      expect(() => dataset.value('foo', null)).toThrowError();
      // @ts-expect-error
      expect(() => dataset.value(123, 'foo')).toThrowError();
      // @ts-expect-error
      expect(() => dataset.value('foo', 123, null)).toThrowError();
    }
  });
});

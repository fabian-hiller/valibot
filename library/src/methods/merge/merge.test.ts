import { describe, expect, test } from 'vitest';
import { number, object, string } from '../../schemas/index.ts';
import { comparable } from '../../utils/index.ts';
import { merge } from '../merge/index.ts';
import { parse } from '../parse/index.ts';

describe('merge', () => {
  test('should merge object schemas', () => {
    const schema = merge([
      object({ key1: string() }),
      object({ key2: number() }),
    ]);
    expect(schema).toEqual(
      comparable(object({ key1: string(), key2: number() }))
    );
    const input = { key1: '1', key2: 2 };
    const output1 = parse(schema, input);
    expect(output1).toEqual(input);
    expect(() => parse(schema, { key1: '1' })).toThrowError();
    expect(() => parse(schema, { key2: 2 })).toThrowError();
  });

  test('should overwrite schema of key', () => {
    const schema = merge([
      object({ key: string() }),
      object({ key: number() }),
    ]);
    expect(schema.object.key).toEqual(comparable(number()));
    const input = { key: 123 };
    const output = parse(schema, input);
    expect(output).toEqual(input);
    expect(() => parse(schema, { key: 'test' })).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an object!';
    const schema = merge(
      [object({ key1: string() }), object({ key2: number() })],
      error
    );
    expect(() => parse(schema, 123)).toThrowError(error);
  });

  test('should execute pipe', () => {
    const input = { key1: '1', key2: 1 };
    const transformInput = () => ({ key1: '2', key2: 2 });
    const output1 = parse(
      merge(
        [object({ key1: string() }), object({ key2: number() })],
        [transformInput]
      ),
      input
    );
    const output2 = parse(
      merge([object({ key1: string() }), object({ key2: number() })], 'Error', [
        transformInput,
      ]),
      input
    );
    expect(output1).toEqual(transformInput());
    expect(output2).toEqual(transformInput());
  });
});

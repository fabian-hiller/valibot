import { describe, expect, test } from 'vitest';
import { comparable } from '../../comparable.ts';
import { number, object, string } from '../../schemas/index.ts';
import { toCustom } from '../../transformations/index.ts';
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
    expect(schema.entries.key).toEqual(comparable(number()));
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
        [toCustom(transformInput)]
      ),
      input
    );
    const output2 = parse(
      merge([object({ key1: string() }), object({ key2: number() })], 'Error', [
        toCustom(transformInput),
      ]),
      input
    );
    expect(output1).toEqual(transformInput());
    expect(output2).toEqual(transformInput());
  });

  test('should expose the metadata', async () => {
    const schema1 = merge(
      [object({ key1: string() }), object({ key2: number() })],
      { description: 'a simple object' }
    );
    expect(schema1.metadata).toEqual({ description: 'a simple object' });
    const schema2 = merge(
      [object({ key1: string() }), object({ key2: number() })],
      number(),
      { description: 'an object with a rest' }
    );
    expect(schema2.metadata).toEqual({ description: 'an object with a rest' });

    const schema3 = merge(
      [object({ key1: string() }), object({ key2: number() })],
      { description: 'a simple object', message: 'Value is not an object!' }
    );
    expect(schema3.metadata).toEqual({ description: 'a simple object' });
    expect(schema3.message).toEqual('Value is not an object!');
  });
});

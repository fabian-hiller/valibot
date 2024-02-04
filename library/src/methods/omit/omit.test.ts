import { describe, expect, test } from 'vitest';
import { comparable } from '../../comparable.ts';
import { number, object, string } from '../../schemas/index.ts';
import { toCustom } from '../../transformations/index.ts';
import { omit } from '../omit/index.ts';
import { parse } from '../parse/index.ts';

describe('omit', () => {
  test('should omit two object keys', () => {
    const schema = omit(
      object({ key1: string(), key2: string(), key3: string() }),
      ['key1', 'key3']
    );
    expect(schema).toEqual(comparable(object({ key2: string() })));
    const input = { key2: 'test' };
    const output = parse(schema, input);
    expect(output).toEqual(input);
    expect(() => parse(schema, { key1: 'test' })).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an object!';
    const schema = omit(
      object({ key1: string(), key2: string() }),
      ['key1'],
      error
    );
    expect(() => parse(schema, 123)).toThrowError(error);
  });

  test('should execute pipe', () => {
    const input = { key2: '1' };
    const transformInput = () => ({ key2: '2' });
    const output1 = parse(
      omit(
        object({ key1: string(), key2: string() }),
        ['key1'],
        [toCustom(transformInput)]
      ),
      input
    );
    const output2 = parse(
      omit(object({ key1: string(), key2: string() }), ['key1'], 'Error', [
        toCustom(transformInput),
      ]),
      input
    );
    expect(output1).toEqual(transformInput());
    expect(output2).toEqual(transformInput());
  });

  test('should expose the metadata', async () => {
    const schema1 = omit(
      object({ key1: string(), key2: string(), key3: string() }),
      ['key1', 'key3'],
      { description: 'a simple object' }
    );
    expect(schema1.metadata).toEqual({ description: 'a simple object' });

    const schema2 = omit(
      object({ key1: string(), key2: string(), key3: string() }),
      ['key1', 'key3'],
      number(),
      { description: 'an object with a rest' }
    );
    expect(schema2.metadata).toEqual({ description: 'an object with a rest' });

    const schema3 = omit(
      object({ key1: string(), key2: string(), key3: string() }),
      ['key1', 'key3'],
      { description: 'a simple object', message: 'Value is not an object!' }
    );
    expect(schema3.metadata).toEqual({ description: 'a simple object' });
    expect(schema3.message).toEqual('Value is not an object!');
  });
});

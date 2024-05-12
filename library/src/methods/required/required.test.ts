import { describe, expect, test } from 'vitest';
import { comparable } from '../../comparable.ts';
import { nonOptional, object, optional, string } from '../../schemas/index.ts';
import { toCustom } from '../../transformations/index.ts';
import { parse } from '../parse/index.ts';
import { required } from './required.ts';

describe('required', () => {
  test('should have non optional keys', () => {
    const schema = required(
      object({ key1: optional(string()), key2: string() })
    );
    expect(schema).toEqual(
      comparable(
        object({
          key1: nonOptional(optional(string())),
          key2: nonOptional(string()),
        })
      )
    );
    const input = { key1: 'test', key2: 'test' };
    const output = parse(schema, input);
    expect(output).toEqual(input);
    expect(() => parse(schema, { key2: 'test' })).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an object!';
    const schema = required(object({ key1: string(), key2: string() }), error);
    expect(() => parse(schema, 123)).toThrowError(error);
  });

  test('should execute pipe', () => {
    const input = { key1: '1' };
    const transformInput = () => ({ key1: '2' });
    const output1 = parse(
      required(object({ key1: string() }), [toCustom(transformInput)]),
      input
    );
    const output2 = parse(
      required(object({ key1: string() }), 'Error', [toCustom(transformInput)]),
      input
    );
    expect(output1).toEqual(transformInput());
    expect(output2).toEqual(transformInput());
  });

  test('should expose the metadata', async () => {
    const schema1 = required(
      object({ key1: string(), key2: string(), key3: string() }),
      { description: 'a simple object' }
    );
    expect(schema1.metadata).toEqual({ description: 'a simple object' });

    const schema2 = required(
      object({ key1: string(), key2: string(), key3: string() }),
      { description: 'a simple object', message: 'Value is not an object!' }
    );
    expect(schema2.metadata).toEqual({ description: 'a simple object' });
    expect(schema2.message).toEqual('Value is not an object!');
  });
});

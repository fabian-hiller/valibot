import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { toCustom } from '../../transformations/index.ts';
import { blob } from './blob.ts';

describe('blob', () => {
  test('should pass only blobs', () => {
    const schema = blob();
    const input = new Blob(['123']);
    const output = parse(schema, input);
    expect(output).toBe(input);
    expect(() => parse(schema, 2023)).toThrowError();
    expect(() => parse(schema, new Date())).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not a blob!';
    expect(() => parse(blob(error), 123)).toThrowError(error);
  });

  test('should execute pipe', () => {
    const value = new Blob(['123']);
    const output = parse(blob([toCustom(() => value)]), new Blob());
    expect(output).toBe(value);
  });

  test('should expose the metadata', () => {
    const schema1 = blob({ description: 'blob value' });
    expect(schema1.metadata).toEqual({ description: 'blob value' });

    const schema2 = blob({
      description: 'blob value',
      message: 'Value is not a blob!',
    });
    expect(schema2.metadata).toEqual({ description: 'blob value' });
    expect(schema2.message).toEqual('Value is not a blob!');

    const schema3 = blob();
    expect(schema3.metadata).toBeUndefined();
  });
});

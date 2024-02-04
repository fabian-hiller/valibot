import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { void_ } from './void.ts';

describe('void', () => {
  test('should pass only void', () => {
    const schema = void_();
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    expect(parse(schema, (() => {})())).toBeUndefined();
    expect(parse(schema, undefined)).toBeUndefined();
    expect(() => parse(schema, 123)).toThrowError();
    expect(() => parse(schema, 'test')).toThrowError();
    expect(() => parse(schema, false)).toThrowError();
    expect(() => parse(schema, null)).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not void!';
    expect(() => parse(void_(error), 123)).toThrowError(error);
  });

  test('should expose the metadata', () => {
    const schema1 = void_({ description: 'void value' });
    expect(schema1.metadata).toEqual({ description: 'void value' });

    const schema2 = void_({
      description: 'void value',
      message: 'Value is not a void!',
    });
    expect(schema2.metadata).toEqual({ description: 'void value' });
    expect(schema2.message).toEqual('Value is not a void!');

    const schema3 = void_();
    expect(schema3.metadata).toBeUndefined();
  });
});

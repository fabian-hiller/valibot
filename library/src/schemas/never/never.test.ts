import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { never } from './never.ts';

describe('never', () => {
  test('should pass no value', () => {
    const schema = never();
    expect(() => parse(schema, null)).toThrowError();
    expect(() => parse(schema, undefined)).toThrowError();
    expect(() => parse(schema, 123)).toThrowError();
    expect(() => parse(schema, 'test')).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not never!';
    expect(() => parse(never(error), undefined)).toThrowError(error);
  });

  test('should expose the metadata', () => {
    const schema1 = never({ description: 'never value' });
    expect(schema1.metadata).toEqual({ description: 'never value' });

    const schema2 = never({
      description: 'never value',
      message: 'Value is not a never!',
    });
    expect(schema2.metadata).toEqual({ description: 'never value' });
    expect(schema2.message).toEqual('Value is not a never!');

    const schema3 = never();
    expect(schema3.metadata).toBeUndefined();
  });
});

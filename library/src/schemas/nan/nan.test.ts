import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { nan } from './nan.ts';

describe('nan', () => {
  test('should pass only NaN', () => {
    const schema = nan();
    const input = NaN;
    const output = parse(schema, input);
    expect(output).toBe(input);
    expect(() => parse(schema, 123)).toThrowError();
    expect(() => parse(schema, '123')).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not NaN!';
    expect(() => parse(nan(error), 123)).toThrowError(error);
  });

  test('should expose the metadata', () => {
    const schema1 = nan({ description: 'NaN value' });
    expect(schema1.metadata).toEqual({ description: 'NaN value' });

    const schema2 = nan({
      description: 'NaN value',
      message: 'Value is not a NaN!',
    });
    expect(schema2.metadata).toEqual({ description: 'NaN value' });
    expect(schema2.message).toEqual('Value is not a NaN!');

    const schema3 = nan();
    expect(schema3.metadata).toBeUndefined();
  });
});

import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { toCustom } from '../../transformations/index.ts';
import { boolean } from './boolean.ts';

describe('boolean', () => {
  test('should pass only booleans', () => {
    const schema = boolean();
    const input1 = true;
    const output1 = parse(schema, input1);
    expect(output1).toBe(input1);
    const input2 = false;
    const output2 = parse(schema, input2);
    expect(output2).toBe(input2);
    expect(() => parse(schema, 123)).toThrowError();
    expect(() => parse(schema, 'true')).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not a boolean!';
    expect(() => parse(boolean(error), 'test')).toThrowError(error);
  });

  test('should execute pipe', () => {
    const transformInput = () => false;
    const output1 = parse(boolean([toCustom(transformInput)]), true);
    expect(output1).toBe(transformInput());
    const output2 = parse(boolean('Error', [toCustom(transformInput)]), true);
    expect(output2).toBe(transformInput());
  });

  test('should expose the metadata', () => {
    const schema1 = boolean({ description: 'boolean value' });
    expect(schema1.metadata).toEqual({ description: 'boolean value' });

    const schema2 = boolean({
      description: 'boolean value',
      message: 'Value is not a boolean!',
    });
    expect(schema2.metadata).toEqual({ description: 'boolean value' });
    expect(schema2.message).toEqual('Value is not a boolean!');

    const schema3 = boolean();
    expect(schema3.metadata).toBeUndefined();
  });
});

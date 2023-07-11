import { describe, expect, test } from 'vitest';
import { parse } from '../methods';
import { boolean } from './boolean';

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
    const output1 = parse(boolean([transformInput]), true);
    expect(output1).toBe(transformInput());
    const output2 = parse(boolean('Error', [transformInput]), true);
    expect(output2).toBe(transformInput());
  });
});

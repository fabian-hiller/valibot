import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { picklist } from './picklist.ts';

describe('picklist', () => {
  test('should pass only picklist values', () => {
    const schema = picklist(['value_1', 'value_2']);
    const input1 = 'value_1';
    const output1 = parse(schema, input1);
    expect(output1).toBe(input1);
    const input2 = 'value_2';
    const output2 = parse(schema, input2);
    expect(output2).toBe(input2);
    expect(() => parse(schema, 123)).toThrowError();
    expect(() => parse(schema, 'value_3')).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not a picklist value!';
    expect(() => parse(picklist(['value_1'], error), 'test')).toThrowError(
      error
    );
  });
});

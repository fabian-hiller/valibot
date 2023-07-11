import { describe, expect, test } from 'vitest';
import { parse } from '../methods';
import { enumType } from './enumType';

describe('enumType', () => {
  test('should pass only enum values', () => {
    const schema = enumType(['value_1', 'value_2']);
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
    const error = 'Value is not a enum value!';
    expect(() => parse(enumType(['value_1'], error), 'test')).toThrowError(
      error
    );
  });
});

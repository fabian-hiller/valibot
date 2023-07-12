import { describe, expect, test } from 'vitest';
import { parse } from '../../methods';
import { email, maxLength, minLength } from '../../validations';
import { string } from './string';

describe('string', () => {
  test('should pass only strings', () => {
    const schema = string();
    const input = '';
    const output = parse(schema, input);
    expect(output).toBe(input);
    expect(() => parse(schema, 123n)).toThrowError();
    expect(() => parse(schema, null)).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not a string!';
    expect(() => parse(string(error), 123)).toThrowError(error);
  });

  test('should execute pipe', () => {
    const lengthError = 'Invalid length';
    const schema1 = string([minLength(1), maxLength(3)]);
    const input1 = '12';
    const output1 = parse(schema1, input1);
    expect(output1).toBe(input1);
    expect(() => parse(schema1, '')).toThrowError(lengthError);
    expect(() => parse(schema1, '1234')).toThrowError(lengthError);

    const emailError = 'Invalid email';
    const schema2 = string('Error', [email()]);
    const input2 = 'jane@example.com';
    const output2 = parse(schema2, input2);
    expect(output2).toBe(input2);
    expect(() => parse(schema2, 'jane@example')).toThrowError(emailError);
  });
});

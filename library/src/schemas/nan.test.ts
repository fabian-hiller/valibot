import { describe, expect, test } from 'vitest';
import { parse } from '../methods';
import { nan } from './nan';

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
});

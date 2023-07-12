import { describe, expect, test } from 'vitest';
import { parse } from '../../methods';
import { minLength } from '../../validations';
import { string } from '../string';
import { recursive } from './recursive';

describe('recursive', () => {
  test('should pass only getter schema', () => {
    const schema = recursive(() => string([minLength(3)]));
    const input = 'hello';
    const output = parse(schema, input);
    expect(output).toBe(input);
    expect(() => parse(schema, 'he')).toThrowError();
    expect(() => parse(schema, 123n)).toThrowError();
    expect(() => parse(schema, null)).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
  });
});

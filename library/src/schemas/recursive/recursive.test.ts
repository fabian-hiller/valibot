import { describe, expect, test, vi } from 'vitest';
import { parse } from '../../methods/index.ts';
import { minLength } from '../../validations/index.ts';
import { string } from '../string/index.ts';
import { recursive } from './recursive.ts';

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

  test('should expose the metadata', () => {
    const schema1 = recursive(() => string(), {
      description: 'recursive value',
    });
    expect(schema1.metadata).toEqual({ description: 'recursive value' });
  });

  test('should pass the input to the getter function as a parameter', () => {
    const getter = vi.fn().mockReturnValue({ _parse: string()._parse });
    const schema = recursive(getter);
    const input = 'hello';
    parse(schema, input);
    expect(getter).toHaveBeenCalledWith(input);
  });
});

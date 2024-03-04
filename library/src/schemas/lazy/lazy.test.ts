import { describe, expect, test, vi } from 'vitest';
import { parse } from '../../methods/index.ts';
import { minLength } from '../../validations/index.ts';
import { string } from '../string/index.ts';
import { lazy } from './lazy.ts';

describe('lazy', () => {
  test('should pass only getter schema', () => {
    const schema = lazy(() => string([minLength(3)]));
    const input = 'hello';
    const output = parse(schema, input);
    expect(output).toBe(input);
    expect(() => parse(schema, 'he')).toThrowError();
    expect(() => parse(schema, 123n)).toThrowError();
    expect(() => parse(schema, null)).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
  });

  test('should pass the input to the getter function as a parameter', () => {
    const getter = vi.fn().mockReturnValue({ _parse: string()._parse });
    const schema = lazy(getter);
    const input = 'hello';
    parse(schema, input);
    expect(getter).toHaveBeenCalledWith(input);
  });
});

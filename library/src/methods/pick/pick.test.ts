import { describe, expect, test } from 'vitest';
import { object, string } from '../../schemas/index.ts';
import { toCustom } from '../../transformations/index.ts';
import { parse } from '../parse/index.ts';
import { pick } from './pick.ts';

describe('pick', () => {
  test('should pick two object keys', () => {
    const schema = pick(
      object({ key1: string(), key2: string(), key3: string() }),
      ['key1', 'key3']
    );
    expect(schema).toEqualSchema(object({ key1: string(), key3: string() }));
    const input = { key1: 'test', key3: 'test' };
    const output = parse(schema, input);
    expect(output).toEqual(input);
    expect(() => parse(schema, { key1: 'test', key2: 'test' })).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an object!';
    const schema = pick(
      object({ key1: string(), key2: string() }),
      ['key1'],
      error
    );
    expect(() => parse(schema, 123)).toThrowError(error);
  });

  test('should execute pipe', () => {
    const input = { key1: '1' };
    const transformInput = () => ({ key1: '2' });
    const output1 = parse(
      pick(
        object({ key1: string(), key2: string() }),
        ['key1'],
        [toCustom(transformInput)]
      ),
      input
    );
    const output2 = parse(
      pick(object({ key1: string(), key2: string() }), ['key1'], 'Error', [
        toCustom(transformInput),
      ]),
      input
    );
    expect(output1).toEqual(transformInput());
    expect(output2).toEqual(transformInput());
  });
});

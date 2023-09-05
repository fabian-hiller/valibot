import { describe, expect, test } from 'vitest';
import { number, object, string } from '../../schemas/index.ts';
import { parse } from '../parse/index.ts';
import { strict } from './strict.ts';

describe('strict', () => {
  test('should detect unknown keys', () => {
    const schema = strict(object({ key1: string(), key2: number() }));

    const input1 = { key1: 'test', key2: 123 };
    const output1 = parse(schema, input1);
    expect(output1).toEqual(input1);

    const input2 = { key1: 'test', key2: 123, key3: 'unknown' };
    expect(() => parse(schema, input2)).toThrowError('Invalid keys: key3');
    const input3 = { key1: 'test', key2: 123, key3: 'unknown', key4: 123 };
    expect(() => parse(schema, input3)).toThrowError(
      'Invalid keys: key3, key4'
    );
  });

  test('should return original issues', () => {
    const schema = strict(object({ key1: string(), key2: number() }));
    const input = { key1: 'test', key2: 'test' };
    const result = schema._parse(input);
    expect(result.issues).toBeDefined();
    expect(result.issues).toHaveLength(1);
  });
});

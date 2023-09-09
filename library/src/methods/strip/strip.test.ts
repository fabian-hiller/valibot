import { describe, expect, test } from 'vitest';
import { object, string } from '../../schemas/index.ts';
import { passthrough } from '../passthrough/index.ts';
import { strip } from './strip.ts';

describe('strip', () => {
  test('should strip unknown keys', () => {
    const schema = strip(passthrough(object({ key1: string() })));

    const input1 = { key1: 'test' };
    const result1 = schema._parse(input1);
    expect(result1.output).toEqual(input1);

    const input2 = { key1: 'test', key2: 123 };
    const result2 = schema._parse(input2);
    expect(result2.output).toEqual(input1);

    const input3 = { key1: 123 };
    const result3 = schema._parse(input3);
    expect(result3.issues?.length).toBe(1);

    const input4 = { key1: 123, key2: 123 };
    const result4 = schema._parse(input4);
    expect(result4.issues?.length).toBe(1);
  });
});

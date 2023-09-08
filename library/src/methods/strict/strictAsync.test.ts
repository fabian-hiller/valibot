import { describe, expect, test } from 'vitest';
import { number, objectAsync, optional, string } from '../../schemas/index.ts';
import { strictAsync } from './strictAsync.ts';

describe('strict', () => {
  test('should detect unknown keys', async () => {
    const schema = strictAsync(
      objectAsync({ key1: string(), key2: optional(number()) })
    );

    const input1 = { key1: 'test', key2: 123 };
    const result1 = await schema._parse(input1);
    expect(result1.output).toEqual(input1);

    const input2 = { key1: 'test', key2: undefined };
    const result2 = await schema._parse(input2);
    expect(result2.output).toEqual(input2);

    const input3 = { key1: 'test' };
    const result3 = await schema._parse(input3);
    expect(result3.output).toEqual(input3);

    const input4 = { key1: 'test', key2: 123, key3: '' };
    const result4 = await schema._parse(input4);
    expect(result4.issues?.length).toBe(1);

    const input5 = { key1: 'test', key2: undefined, key3: '' };
    const result5 = await schema._parse(input5);
    expect(result5.issues?.length).toBe(1);

    const input6 = { key1: 'test', key3: '' };
    const result6 = await schema._parse(input6);
    expect(result6.issues?.length).toBe(1);

    const input7 = { key1: 'test', key2: 123, key3: '', key4: '' };
    const result7 = await schema._parse(input7);
    expect(result7.issues?.length).toBe(1);
  });
});

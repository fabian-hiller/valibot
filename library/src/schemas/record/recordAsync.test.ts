import { describe, expect, test } from 'vitest';
import { type ValiError } from '../../error/index.ts';
import { parseAsync } from '../../methods/index.ts';
import { minLength } from '../../validations/index.ts';
import { any } from '../any/index.ts';
import { number } from '../number/index.ts';
import { string, stringAsync } from '../string/index.ts';
import { numberAsync } from '../number/index.ts';
import { unionAsync } from '../union/index.ts';
import { recordAsync } from './recordAsync.ts';

describe('recordAsync', () => {
  test('should pass only objects', async () => {
    const schema1 = recordAsync(number());
    const input1 = { key1: 1, key2: 2 };
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toEqual(input1);
    await expect(parseAsync(schema1, { test: 'hello' })).rejects.toThrowError();
    await expect(parseAsync(schema1, 'test')).rejects.toThrowError();
    await expect(parseAsync(schema1, 123)).rejects.toThrowError();
    await expect(
      parseAsync(schema1, new Map().set('key1', '1'))
    ).rejects.toThrowError();

    const schema2 = recordAsync(
      stringAsync([minLength(3)]),
      unionAsync([string(), numberAsync()])
    );
    const input2 = { 1234: 1234, test: 'hello' };
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toEqual(input2);
    await expect(parseAsync(schema2, { a: 'test' })).rejects.toThrowError();
    await expect(parseAsync(schema2, { test: null })).rejects.toThrowError();
    await expect(parseAsync(schema2, 'test')).rejects.toThrowError();
    await expect(parseAsync(schema2, 123)).rejects.toThrowError();
    await expect(parseAsync(schema2, new Set())).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not an object!';
    const schema1 = recordAsync(string(), error);
    const schema2 = recordAsync(string(), stringAsync(), error);
    await expect(parseAsync(schema1, 123)).rejects.toThrowError(error);
    await expect(parseAsync(schema2, new Date())).rejects.toThrowError(error);
  });

  test('should throw every issue', async () => {
    const schema = recordAsync(number());
    const input = { 1: '1', 2: 2, 3: '3' };
    await expect(parseAsync(schema, input)).rejects.toThrowError();
    try {
      await parseAsync(schema, input);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(2);
    }
  });

  test('should throw only first issue', async () => {
    const info = { abortEarly: true };

    const schema1 = recordAsync(number());
    const input1 = { 1: '1', 2: 2, 3: '3' };
    await expect(parseAsync(schema1, input1, info)).rejects.toThrowError();
    try {
      await parseAsync(schema1, input1, info);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
      expect((error as ValiError).issues[0].origin).toBe('value');
    }

    const schema2 = recordAsync(string([minLength(2)]), number());
    const input2 = { '1': '1', 2: 2, 3: '3' };
    await expect(parseAsync(schema2, input2, info)).rejects.toThrowError();
    try {
      await parseAsync(schema2, input2, info);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
      expect((error as ValiError).issues[0].origin).toBe('key');
    }
  });

  test('should execute pipe', async () => {
    const input = { key1: 1, key2: 1 };
    const transformInput = () => ({ key1: 2, key2: 2 });
    const output1 = await parseAsync(
      recordAsync(number(), [transformInput]),
      input
    );
    const output2 = await parseAsync(
      recordAsync(string(), number(), [transformInput]),
      input
    );
    const output3 = await parseAsync(
      recordAsync(number(), 'Error', [transformInput]),
      input
    );
    const output4 = await parseAsync(
      recordAsync(string(), number(), 'Error', [transformInput]),
      input
    );
    expect(output1).toEqual(transformInput());
    expect(output2).toEqual(transformInput());
    expect(output3).toEqual(transformInput());
    expect(output4).toEqual(transformInput());
  });

  test('should prevent prototype pollution', async () => {
    const schema = recordAsync(string(), any());
    const input = JSON.parse('{"__proto__":{"polluted":"yes"}}');
    expect(input.__proto__.polluted).toBe('yes');
    expect(({} as any).polluted).toBeUndefined();
    const output = await parseAsync(schema, input);
    expect(output.__proto__.polluted).toBeUndefined();
    expect(output.polluted).toBeUndefined();
  });
});

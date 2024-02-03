import { describe, expect, test } from 'vitest';
import { type ValiError } from '../../error/index.ts';
import { parseAsync } from '../../methods/index.ts';
import { toCustom } from '../../transformations/index.ts';
import { customAsync, minLength } from '../../validations/index.ts';
import { never } from '../never/index.ts';
import { number } from '../number/index.ts';
import { optional } from '../optional/index.ts';
import { string, stringAsync } from '../string/index.ts';
import { objectAsync } from './objectAsync.ts';

describe('objectAsync', () => {
  test('should pass only objects', async () => {
    const schema1 = objectAsync({ key1: stringAsync(), key2: number() });
    const input1 = { key1: 'test', key2: 123 };
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toEqual(input1);
    const input2 = { ...input1, key3: null };
    const outpu2 = await parseAsync(schema1, input2);
    expect(outpu2).toEqual(input1);
    await expect(parseAsync(schema1, 'test')).rejects.toThrowError();
    await expect(parseAsync(schema1, 123)).rejects.toThrowError();
    await expect(parseAsync(schema1, {})).rejects.toThrowError();
    await expect(parseAsync(schema1, new Map())).rejects.toThrowError();

    const schema2 = objectAsync({ key1: string() }, number());
    const input3 = { key1: 'test' };
    const output3 = await parseAsync(schema2, input3);
    expect(output3).toEqual(input3);
    const input4 = { key1: 'test', key2: 123, key3: 456 };
    const output4 = await parseAsync(schema2, input4);
    expect(output4).toEqual(input4);
    await expect(
      parseAsync(schema2, { key1: 'test', key2: '123' })
    ).rejects.toThrowError();

    const schema3 = objectAsync({ key1: string() }, never());
    const input5 = { key1: 'test' };
    const output5 = await parseAsync(schema2, input5);
    expect(output5).toEqual(input5);
    await expect(
      parseAsync(schema3, { key1: 'test', key2: null })
    ).rejects.toThrowError();
  });

  test('should exclude non-existing keys', async () => {
    const schema = objectAsync({ key: optional(string()) });
    const output1 = await parseAsync(schema, { key: undefined });
    expect('key' in output1).toBe(true);
    const output2 = await parseAsync(schema, {});
    expect('key' in output2).toBe(false);
  });

  test('should throw custom error', async () => {
    const error = 'Value is not an object!';
    const schema = objectAsync({}, error);
    await expect(parseAsync(schema, 123)).rejects.toThrowError(error);
  });

  test('should throw every issue', async () => {
    const schema = objectAsync({ key1: string(), key2: string() }, number());
    const input = { key1: 1, key2: 2, key3: 3, key4: '4', key5: '5' };
    await expect(parseAsync(schema, input)).rejects.toThrowError();
    try {
      await parseAsync(schema, input);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(4);
    }
  });

  test('should throw only first issue', async () => {
    const info = { abortEarly: true };
    const schema = objectAsync({ key1: string(), key2: string() }, number());

    const input1 = { key1: 1, key2: 2, key3: 3, key4: '4' };
    await expect(parseAsync(schema, input1, info)).rejects.toThrowError();
    try {
      await parseAsync(schema, input1, info);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
    }

    const input2 = { key1: '1', key2: '2', key3: '3', key4: '4' };
    await expect(parseAsync(schema, input2, info)).rejects.toThrowError();
    try {
      await parseAsync(schema, input2, info);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
    }
  });

  test('should return issue path', async () => {
    const schema1 = objectAsync({ key: number() });
    const input1 = { key: '123' };
    const result1 = await schema1._parse(input1);
    expect(result1.issues?.[0].path).toEqual([
      {
        type: 'object',
        input: input1,
        key: 'key',
        value: input1.key,
      },
    ]);

    const schema2 = objectAsync({ nested: objectAsync({ key: string() }) });
    const input2 = { nested: { key: 123 } };
    const result2 = await schema2._parse(input2);
    expect(result2.issues?.[0].path).toEqual([
      {
        type: 'object',
        input: input2,
        key: 'nested',
        value: input2.nested,
      },
      {
        type: 'object',
        input: input2.nested,
        key: 'key',
        value: input2.nested.key,
      },
    ]);

    const schema3 = objectAsync({ key1: string() }, number());
    const input3 = { key1: 'hello', key2: 'world' };
    const result3 = await schema3._parse(input3);
    expect(result3.issues?.[0].path).toEqual([
      {
        type: 'object',
        input: input3,
        key: 'key2',
        value: input3.key2,
      },
    ]);

    const schema4 = objectAsync({}, objectAsync({ key: string() }));
    const input4 = { nested: { key: 123 } };
    const result4 = await schema4._parse(input4);
    expect(result4.issues?.[0].path).toEqual([
      {
        type: 'object',
        input: input4,
        key: 'nested',
        value: input4.nested,
      },
      {
        type: 'object',
        input: input4.nested,
        key: 'key',
        value: input4.nested.key,
      },
    ]);
  });

  test('should execute pipe', async () => {
    const input = { key1: '1', key2: 1 };
    const transformInput = () => ({ key1: '2', key2: 2 });
    const output1 = await parseAsync(
      objectAsync({ key1: string(), key2: number() }, [
        toCustom(transformInput),
      ]),
      input
    );
    const output2 = await parseAsync(
      objectAsync({ key1: string(), key2: number() }, 'Error', [
        toCustom(transformInput),
      ]),
      input
    );
    expect(output1).toEqual(transformInput());
    expect(output2).toEqual(transformInput());
  });

  test('should execute pipe if output is typed', async () => {
    const requirement = async (value: { key: string }) =>
      value.key.length >= 10;
    const schema = objectAsync({ key: string([minLength(10)]) }, [
      customAsync(requirement),
    ]);
    const input = { key: '12345' };
    const result = await schema._parse(input);
    expect(result).toEqual({
      typed: true,
      output: input,
      issues: [
        {
          reason: 'string',
          validation: 'min_length',
          origin: 'value',
          message: 'Invalid length',
          input: input.key,
          requirement: 10,
          path: [
            {
              type: 'object',
              input: input,
              key: 'key',
              value: input.key,
            },
          ],
        },
        {
          reason: 'object',
          validation: 'custom',
          origin: 'value',
          message: 'Invalid input',
          input: input,
          requirement,
        },
      ],
    });
  });

  test('should skip pipe if output is not typed', async () => {
    const schema = objectAsync({ key: string() }, [
      customAsync(async (value) => value.key.length >= 10),
    ]);
    const input = { key: 12345 };
    const result = await schema._parse(input);
    expect(result).toEqual({
      typed: false,
      output: input,
      issues: [
        {
          reason: 'type',
          validation: 'string',
          origin: 'value',
          message: 'Invalid type',
          input: input.key,
          path: [
            {
              type: 'object',
              input: input,
              key: 'key',
              value: input.key,
            },
          ],
        },
      ],
    });
  });

  test('should expose the metadata', async () => {
    const schema1 = objectAsync(
      { key: string() },
      { description: 'a simple object' }
    );
    expect(schema1.metadata).toEqual({ description: 'a simple object' });
    const schema2 = objectAsync({ key: string() }, number(), {
      description: 'an object with a rest',
    });
    expect(schema2.metadata).toEqual({ description: 'an object with a rest' });
  });
});

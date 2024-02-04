import { describe, expect, test } from 'vitest';
import { type ValiError } from '../../error/index.ts';
import { parseAsync } from '../../methods/index.ts';
import { toCustom } from '../../transformations/index.ts';
import { custom, maxLength, minLength } from '../../validations/index.ts';
import { any } from '../any/index.ts';
import { number, numberAsync } from '../number/index.ts';
import { object } from '../object/index.ts';
import { string, stringAsync } from '../string/index.ts';
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
  });

  test('should throw custom error', async () => {
    const error = 'Value is not an object!';
    const schema = recordAsync(string(), error);
    await expect(parseAsync(schema, 123)).rejects.toThrowError(error);
  });

  test('should throw every issue', async () => {
    const schema1 = recordAsync(number());
    const input1 = { 1: '1', 2: 2, 3: '3', 4: '4' };
    await expect(parseAsync(schema1, input1)).rejects.toThrowError();
    try {
      await parseAsync(schema1, input1);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(3);
    }

    const schema2 = recordAsync(string([minLength(2)]), number());
    const input2 = { '1': '1', 2: 2, 3: '3' };
    await expect(parseAsync(schema2, input2)).rejects.toThrowError();
    try {
      await parseAsync(schema2, input2);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(5);
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

  test('should return issue path', async () => {
    const schema1 = recordAsync(number());
    const input1 = { a: 1, b: '2', c: 3 };
    const result1 = await schema1._parse(input1);
    expect(result1.issues?.[0].path).toEqual([
      {
        type: 'record',
        input: input1,
        key: 'b',
        value: input1.b,
      },
    ]);

    const schema2 = recordAsync(object({ key: string() }));
    const input2 = { a: { key: 'test' }, b: { key: 123 } };
    const result2 = await schema2._parse(input2);
    expect(result2.issues?.[0].origin).toBe('value');
    expect(result2.issues?.[0].path).toEqual([
      {
        type: 'record',
        input: input2,
        key: 'b',
        value: input2.b,
      },
      {
        type: 'object',
        input: input2.b,
        key: 'key',
        value: input2.b.key,
      },
    ]);

    const schema3 = recordAsync(string([maxLength(1)]), number());
    const input3 = { a: 1, bb: 2, c: 3 };
    const result3 = await schema3._parse(input3);
    expect(result3.issues?.[0].origin).toBe('key');
    expect(result3.issues?.[0].path).toEqual([
      {
        type: 'record',
        input: input3,
        key: 'bb',
        value: input3.bb,
      },
    ]);
  });

  test('should execute pipe', async () => {
    const input = { key1: 1, key2: 1 };
    const transformInput = (): Record<string, number> => ({ key1: 2, key2: 2 });
    const output1 = await parseAsync(
      recordAsync(number(), [toCustom(transformInput)]),
      input
    );
    const output2 = await parseAsync(
      recordAsync(string(), number(), [toCustom(transformInput)]),
      input
    );
    const output3 = await parseAsync(
      recordAsync(number(), 'Error', [toCustom(transformInput)]),
      input
    );
    const output4 = await parseAsync(
      recordAsync(string(), number(), 'Error', [toCustom(transformInput)]),
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

  test('should execute pipe if output is typed', async () => {
    const requirement = (value: Record<string, string>) =>
      value.key.length >= 10;
    const schema = recordAsync(string([minLength(10)]), [custom(requirement)]);
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
              type: 'record',
              input: input,
              key: 'key',
              value: input.key,
            },
          ],
        },
        {
          reason: 'record',
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
    const schema = recordAsync(string(), [
      custom((value) => value.key.length >= 10),
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
              type: 'record',
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
    const schema2 = recordAsync(string(), {
      description: 'a record without key',
    });
    expect(schema2.metadata).toEqual({ description: 'a record without key' });

    const schema1 = recordAsync(string(), any(), {
      description: 'a simple record',
    });
    expect(schema1.metadata).toEqual({ description: 'a simple record' });
  });
});

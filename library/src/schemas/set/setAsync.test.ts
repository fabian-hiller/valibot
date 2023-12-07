import { describe, expect, test } from 'vitest';
import { type ValiError } from '../../error/index.ts';
import { parseAsync } from '../../methods/index.ts';
import { maxSize, minLength, minSize, size } from '../../validations/index.ts';
import { date } from '../date/index.ts';
import { number } from '../number/index.ts';
import { object } from '../object/index.ts';
import { string } from '../string/index.ts';
import { setAsync } from './setAsync.ts';

describe('setAsync', () => {
  test('should pass only sets', async () => {
    const schema1 = setAsync(string());
    const input1 = new Set().add('hello');
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toEqual(input1);

    const schema2 = setAsync(date());
    const input2 = new Set().add(new Date()).add(new Date());
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toEqual(input2);
    const input3 = new Set();
    const output3 = await parseAsync(schema2, input3);
    expect(output3).toEqual(input3);

    await expect(
      parseAsync(schema1, new Set().add(123))
    ).rejects.toThrowError();
    await expect(
      parseAsync(schema1, new Set().add('hello').add(123))
    ).rejects.toThrowError();
    await expect(parseAsync(schema1, new Map())).rejects.toThrowError();
    await expect(parseAsync(schema1, 123)).rejects.toThrowError();
    await expect(parseAsync(schema1, 'test')).rejects.toThrowError();
    await expect(parseAsync(schema1, {})).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not an set!';
    const schema = setAsync(number(), error);
    await expect(parseAsync(schema, 'test')).rejects.toThrowError(error);
  });

  test('should throw every issue', async () => {
    const schema = setAsync(number());
    const input = new Set().add('1').add(2).add('3');
    await expect(parseAsync(schema, input)).rejects.toThrowError();
    try {
      await parseAsync(schema, input);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(2);
    }
  });

  test('should throw only first issue', async () => {
    const schema = setAsync(number());
    const input = new Set().add('1').add(2).add('3');
    const info = { abortEarly: true };
    await expect(parseAsync(schema, input, info)).rejects.toThrowError();
    try {
      await parseAsync(schema, input, info);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
    }
  });

  test('should return issue path', async () => {
    const schema1 = setAsync(number());
    const input1 = new Set().add(1).add('2').add(3);
    const result1 = await schema1._parse(input1);
    expect(result1.issues?.[0].path).toEqual([
      {
        type: 'set',
        input: input1,
        key: 1,
        value: '2',
      },
    ]);

    const schema2 = setAsync(object({ key: string() }));
    const input2 = new Set().add({ key: 'hello' }).add({ key: 123 });
    const result2 = await schema2._parse(input2);
    expect(result2.issues?.[0].path).toEqual([
      {
        type: 'set',
        input: input2,
        key: 1,
        value: { key: 123 },
      },
      {
        type: 'object',
        input: { key: 123 },
        key: 'key',
        value: 123,
      },
    ]);
  });

  test('should execute pipe', async () => {
    const sizeError = 'Invalid size';

    const schema1 = setAsync(number(), [size(1)]);
    const input1 = new Set().add(1);
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toEqual(input1);
    await expect(parseAsync(schema1, new Set())).rejects.toThrowError(
      sizeError
    );
    await expect(parseAsync(schema1, input1.add(2))).rejects.toThrowError(
      sizeError
    );

    const schema2 = setAsync(string(), 'Error', [minSize(2), maxSize(4)]);
    const input2 = new Set().add('1').add('2').add('3');
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toEqual(input2);
    await expect(
      parseAsync(schema2, input2.add('4').add('5'))
    ).rejects.toThrowError(sizeError);
    await expect(parseAsync(schema2, new Set().add('1'))).rejects.toThrowError(
      sizeError
    );
  });

  test('should expose the pipeline', () => {
    const schema1 = setAsync(number(), [size(1)]);
    expect(schema1.pipe).toStrictEqual([
      expect.objectContaining({
        type: 'size',
        requirement: 1,
        message: 'Invalid size',
      }),
    ]);

    const schema2 = setAsync(number());
    expect(schema2.pipe).toBeUndefined();
  });

  test('should execute pipe if output is typed', async () => {
    const schema = setAsync(string([minLength(10)]), [minSize(10)]);
    const input = new Set().add('12345');
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
          input: '12345',
          requirement: 10,
          path: [
            {
              type: 'set',
              input: input,
              key: 0,
              value: '12345',
            },
          ],
        },
        {
          reason: 'set',
          validation: 'min_size',
          origin: 'value',
          message: 'Invalid size',
          input: input,
          requirement: 10,
        },
      ],
    });
  });

  test('should skip pipe if output is not typed', async () => {
    const schema = setAsync(string(), [minSize(10)]);
    const input = new Set().add(12345);
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
          input: 12345,
          path: [
            {
              type: 'set',
              input: input,
              key: 0,
              value: 12345,
            },
          ],
        },
      ],
    });
  });
});

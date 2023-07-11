import { describe, expect, test } from 'vitest';
import { parseAsync } from '../methods';
import { mapAsync } from './mapAsync';
import { string } from './string';
import { date } from './date';
import { number } from './number';
import { numberAsync } from './numberAsync';
import { maxSize, minSize, size } from '../validations';

describe('mapAsync', () => {
  test('should pass only maps', async () => {
    const schema1 = mapAsync(string(), date());
    const input1 = new Map().set('1', new Date());
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toEqual(input1);

    const schema2 = mapAsync(number(), string());
    const input2 = new Map().set(1, '1').set(2, '2');
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toEqual(input2);
    const input3 = new Map();
    const output3 = await parseAsync(schema2, input3);
    expect(output3).toEqual(input3);

    await expect(
      parseAsync(schema1, new Map().set('1', '1'))
    ).rejects.toThrowError();
    await expect(
      parseAsync(schema1, new Map().set(1, '1'))
    ).rejects.toThrowError();
    await expect(parseAsync(schema1, 123)).rejects.toThrowError();
    await expect(parseAsync(schema1, 'test')).rejects.toThrowError();
    await expect(parseAsync(schema1, {})).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not an map!';
    const schema = mapAsync(number(), string(), error);
    await expect(parseAsync(schema, new Set())).rejects.toThrowError(error);
  });

  test('should execute pipe', async () => {
    const sizeError = 'Invalid size';

    const schema1 = mapAsync(numberAsync(), string(), [size(1)]);
    const input1 = new Map().set(1, '1');
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toEqual(input1);
    await expect(parseAsync(schema1, new Map())).rejects.toThrowError(
      sizeError
    );
    await expect(parseAsync(schema1, input1.set(2, '2'))).rejects.toThrowError(
      sizeError
    );

    const schema2 = mapAsync(numberAsync(), string(), 'Error', [
      minSize(2),
      maxSize(4),
    ]);
    const input2 = new Map().set(1, '1').set(2, '2').set(3, '3');
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toEqual(input2);
    await expect(
      parseAsync(schema2, input2.set(4, '4').set(5, '5'))
    ).rejects.toThrowError(sizeError);
    await expect(
      parseAsync(schema2, new Map().set(1, '1'))
    ).rejects.toThrowError(sizeError);
  });
});

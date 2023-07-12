import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods';
import { maxSize, minSize, size } from '../../validations';
import { string } from '../string';
import { date } from '../date';
import { number } from '../number';
import { setAsync } from './setAsync';

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
});

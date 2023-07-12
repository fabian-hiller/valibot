import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods';
import { maxLength, minLength, length, includes } from '../../validations';
import { number, numberAsync } from '../number';
import { arrayAsync } from './arrayAsync';

describe('array', () => {
  test('should pass only arrays', async () => {
    const schema1 = arrayAsync(numberAsync());
    const input1 = [1, 2, 3];
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toEqual(input1);

    const schema2 = arrayAsync(schema1);
    const input2 = [input1, input1, input1];
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toEqual(input2);

    const input3: number[] = [];
    const output3 = await parseAsync(schema2, input3);
    expect(output3).toEqual(input3);

    await expect(parseAsync(schema1, {})).rejects.toThrowError();
    await expect(parseAsync(schema1, 123)).rejects.toThrowError();
    await expect(parseAsync(schema2, input1)).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not an array!';
    const schema = arrayAsync(number(), error);
    await expect(parseAsync(schema, 123)).rejects.toThrowError(error);
  });

  test('should execute pipe', async () => {
    const lengthError = 'Invalid length';
    const contentError = 'Invalid content';

    const schema1 = arrayAsync(number(), [minLength(1), maxLength(3)]);
    const input1 = [1, 2];
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toEqual(input1);
    await expect(parseAsync(schema1, [])).rejects.toThrowError(lengthError);
    await expect(parseAsync(schema1, [1, 2, 3, 4])).rejects.toThrowError(
      lengthError
    );

    const schema2 = arrayAsync(number(), 'Error', [length(1), includes(123)]);
    const input2 = [123];
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toEqual(input2);
    await expect(parseAsync(schema2, [1, 2])).rejects.toThrowError(lengthError);
    await expect(parseAsync(schema2, [1])).rejects.toThrowError(contentError);
  });
});

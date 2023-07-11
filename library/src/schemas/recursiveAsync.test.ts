import { describe, expect, test } from 'vitest';
import { parseAsync } from '../methods';
import { recursiveAsync } from './recursiveAsync';
import { minLength } from '../validations';
import { stringAsync } from './stringAsync';

describe('recursiveAsync', () => {
  test('should pass only getter schema', async () => {
    const schema = recursiveAsync(() => stringAsync([minLength(3)]));
    const input = 'hello';
    const output = await parseAsync(schema, input);
    expect(output).toBe(input);
    await expect(parseAsync(schema, 'he')).rejects.toThrowError();
    await expect(parseAsync(schema, 123n)).rejects.toThrowError();
    await expect(parseAsync(schema, null)).rejects.toThrowError();
    await expect(parseAsync(schema, {})).rejects.toThrowError();
  });
});

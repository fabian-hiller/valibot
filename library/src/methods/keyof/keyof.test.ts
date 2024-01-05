import { describe, expect, test } from 'vitest';
import { enumType, number, object, string } from '../../schemas/index.ts';
import { keyof } from './keyof.ts';

describe('keyof', () => {
  test('should create enum schema', () => {
    const schema = keyof(object({ key1: string(), key2: number() }));
    expect(JSON.stringify(schema)).toEqual(
      JSON.stringify(enumType(['key1', 'key2']))
    );
  });
});

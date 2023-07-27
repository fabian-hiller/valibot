import { describe, expect, test } from 'vitest';
import { comparable } from '../../comparable.ts';
import { enumType, number, object, string } from '../../schemas/index.ts';
import { keyof } from './keyof.ts';

describe('keyof', () => {
  test('should create enum schema', () => {
    const schema = keyof(object({ key1: string(), key2: number() }));
    expect(schema).toEqual(comparable(enumType(['key1', 'key2'])));
  });
});

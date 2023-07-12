import { describe, expect, test } from 'vitest';
import { enumType, number, object, string } from '../../schemas';
import { comparable } from '../../utils';
import { keyof } from './keyof';

describe('keyof', () => {
  test('should create enum schema', () => {
    const schema = keyof(object({ key1: string(), key2: number() }));
    expect(schema).toEqual(comparable(enumType(['key1', 'key2'])));
  });
});

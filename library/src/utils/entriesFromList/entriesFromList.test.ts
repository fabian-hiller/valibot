import { describe, expect, test } from 'vitest';
import { string } from '../../schemas/index.ts';
import { entriesFromList } from './entriesFromList.ts';

describe('entriesFromList', () => {
  test('should return object entries', () => {
    const schema = string();
    expect(entriesFromList(['foo', 'bar', 'baz'], schema)).toEqual({
      foo: schema,
      bar: schema,
      baz: schema,
    });
  });
});

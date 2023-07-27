import { describe, expect, test } from 'vitest';
import { nonOptional, optional, string } from '../../schemas/index.ts';
import { comparable } from '../../utils/index.ts';
import { unwrap } from './unwrap.ts';

describe('unwrap', () => {
  test('should unwrap wrapped schema', () => {
    const schema1 = unwrap(optional(string()));
    expect(schema1).toEqual(comparable(string()));
    const schema2 = unwrap(nonOptional(optional(string())));
    expect(schema2).toEqual(comparable(optional(string())));
    const schema3 = unwrap(unwrap(nonOptional(optional(string()))));
    expect(schema3).toEqual(comparable(string()));
  });
});

import { describe, expect, test } from 'vitest';
import { nonOptional, optional, string } from '../../schemas/index.ts';
import { unwrap } from './unwrap.ts';

describe('unwrap', () => {
  test('should unwrap wrapped schema', () => {
    const schema1 = unwrap(optional(string()));
    expect(JSON.stringify(schema1)).toEqual(JSON.stringify(string()));
    const schema2 = unwrap(nonOptional(optional(string())));
    expect(JSON.stringify(schema2)).toEqual(JSON.stringify(optional(string())));
    const schema3 = unwrap(unwrap(nonOptional(optional(string()))));
    expect(JSON.stringify(schema3)).toEqual(JSON.stringify(string()));
  });
});

import { describe, expect, test } from 'vitest';
import { nonOptional, optional, string } from '../../schemas/index.ts';
import { unwrap } from './unwrap.ts';

describe('unwrap', () => {
  test('should unwrap wrapped schema', () => {
    const schema1 = unwrap(optional(string()));
    expect(schema1).toEqualSchema(string());
    const schema2 = unwrap(nonOptional(optional(string())));
    expect(schema2).toEqualSchema(optional(string()));
    const schema3 = unwrap(unwrap(nonOptional(optional(string()))));
    expect(schema3).toEqualSchema(string());
  });
});

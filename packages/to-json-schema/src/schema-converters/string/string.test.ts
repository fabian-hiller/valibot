import * as v from 'valibot';
import { describe, expect, test } from 'vitest';
import { convertSchema } from '../convertSchema.ts';
import { string } from './string.ts';

describe('string', () => {
  test('should convert schema', () => {
    const converted = string(v.string(), convertSchema);
    expect(converted).toEqual({ type: 'string' });
  });
});

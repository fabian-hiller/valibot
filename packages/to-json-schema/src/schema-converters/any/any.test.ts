import * as v from 'valibot';
import { describe, expect, test } from 'vitest';
import { convertSchema } from '../convertSchema.ts';
import { any } from './any.ts';

describe('any', () => {
  test('should convert schema', () => {
    const converted = any(v.any(), convertSchema);
    expect(converted).toEqual({});
  });
});

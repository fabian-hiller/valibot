import * as v from 'valibot';
import { describe, expect, test } from 'vitest';
import { convertSchema } from '../convertSchema.ts';
import { null_ } from './null.ts';

describe('null', () => {
  test('should convert schema', () => {
    const converted = null_(v.null_(), convertSchema);
    expect(converted).toEqual({ type: 'null' });
  });
});

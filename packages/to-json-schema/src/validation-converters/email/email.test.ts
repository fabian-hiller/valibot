import * as v from 'valibot';
import { describe, expect, test } from 'vitest';
import { email } from './email.ts';

describe('email', () => {
  test('should convert schema', () => {
    const converted = email(v.email());
    expect(converted).toEqual({ type: 'string', format: 'email' });
  });
});

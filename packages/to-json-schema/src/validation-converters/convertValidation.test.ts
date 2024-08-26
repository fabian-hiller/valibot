import * as v from 'valibot';
import { describe, expect, test } from 'vitest';
import { convertValidation } from './convertValidation.ts';

describe('convertValidation', () => {
  test('should fail on unsupported validation', () => {
    const run = () => convertValidation(v.mac64());
    expect(run).toThrowError("Unsupported validation type 'mac64'");
  });

  test('should force conversion on unsupported validation', () => {
    const actual = convertValidation(v.mac64(), { force: true });
    expect(actual).toEqual({});
  });

  test('should convert validation', () => {
    expect(convertValidation(v.email())).toEqual({
      type: 'string',
      format: 'email',
    });
  });
});

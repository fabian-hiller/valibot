import * as v from 'valibot';
import { describe, expect, test } from 'vitest';
import { convertSchema } from './convertSchema.ts';

describe('convertSchema', () => {
  test('should fail on unsupported schema', () => {
    const run = () => convertSchema(v.blob());
    expect(run).toThrowError("Unknown schema type 'blob'");
  });

  test('should force conversion on unsupported schema', () => {
    const actual = convertSchema(v.blob(), { force: true });
    expect(actual).toEqual({});
  });

  test('should fail on unsupported pipe item', () => {
    const run = () =>
      convertSchema(v.pipe(v.string(), v.email(), v.toLowerCase()));
    expect(run).toThrowError("Unknown action kind 'transformation'");
  });

  test('should force conversion unsupported pipe item', () => {
    const actual = convertSchema(v.pipe(v.string(), v.toLowerCase()), {
      force: true,
    });
    expect(actual).toEqual({ type: 'string' });
  });

  test('should convert schema', () => {
    expect(convertSchema(v.string())).toEqual({ type: 'string' });
  });

  test('should convert schema with validation', () => {
    expect(convertSchema(v.pipe(v.string(), v.email()))).toEqual({
      type: 'string',
      format: 'email',
    });
  });
});

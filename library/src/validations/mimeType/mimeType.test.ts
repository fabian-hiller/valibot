import { describe, expect, test } from 'vitest';
import { mimeType } from './mimeType.ts';

describe('mimeType', () => {
  const info = { reason: 'any' as const };

  test('should pass only valid files', () => {
    const validate = mimeType(['image/jepg', 'image/png']);
    const value1 = new File(['foo'], 'foo.png', { type: 'image/png' });
    expect(validate(value1, info)).toEqual(value1);
    expect(() => validate(new File(['foo'], 'foo.mp4'), info)).toThrowError();
    expect(() =>
      validate(new File(['foo'], 'foo.mp4', { type: 'video/mp4' }), info)
    ).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'File does not match the MIME type!';
    const validate = mimeType(['image/jepg'], error);
    expect(() => validate(new File(['123'], 'test'), info)).toThrowError(error);
  });
});

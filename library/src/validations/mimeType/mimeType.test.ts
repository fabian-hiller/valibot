import { describe, expect, test } from 'vitest';
import { mimeType } from './mimeType.ts';

describe('mimeType', () => {
  test('should pass only valid files', () => {
    const validate = mimeType(['image/jepg', 'image/png']);
    const value1 = new File(['foo'], 'foo.png', { type: 'image/png' });
    expect(validate(value1).output).toBe(value1);
    expect(validate(new File(['foo'], 'foo.mp4')).issue).toBeTruthy();
    expect(
      validate(new File(['foo'], 'foo.mp4', { type: 'video/mp4' })).issue
    ).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'File does not match the MIME type!';
    const validate = mimeType(['image/jepg'], error);
    expect(validate(new File(['123'], 'test')).issue?.message).toBe(error);
  });
});

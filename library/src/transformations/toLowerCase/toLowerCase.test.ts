import { describe, expect, test } from 'vitest';
import { toLowerCase } from './toLowerCase.ts';

describe('toLowerCase', () => {
  test('should transform to lower case', () => {
    const transform = toLowerCase();
    expect(transform('TeSt').output).toBe('test');
  });
});

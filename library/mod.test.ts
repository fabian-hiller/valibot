import { describe, expect, test } from 'vitest';

describe('Deno compatibility', () => {
  test('should be able to import mod.ts', async () => {
    const module = await import('./mod.ts');
    expect(module).not.toBeUndefined();
  })
});

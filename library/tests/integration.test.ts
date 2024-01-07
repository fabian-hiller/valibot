import { describe, expect, test } from 'vitest';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
describe('Integration', () => {
  test.each([
    ['4.9.5', false],
    ['5.0.2', true],
  ])(
    'with TypeScript version %s should work: %s',
    async (tsVersion, expectSuccess) => {
      const npx = spawnSync('npx', [
        '--yes',
        '--package',
        `typescript@${tsVersion}`,
        'tsc',
        '--noEmit',
        '--target',
        'ES6',
        join(__dirname, 'testscript.ts'),
      ]);

      const npxOutput = npx.output.toString();
      const containsError = npxOutput.includes('error TS');
      if (expectSuccess) {
        expect(containsError).toBeFalsy();
      } else {
        expect(containsError).toBeTruthy();
      }
    }
  );
});

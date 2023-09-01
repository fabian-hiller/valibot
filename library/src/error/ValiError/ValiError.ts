import type { Issues } from '../../types.ts';

/**
 * A Valibot error with useful information.
 */
export class ValiError extends Error {
  issues: Issues;

  /**
   * Creates a Valibot error with useful information.
   *
   * @param issues The error issues.
   */
  constructor(issues: Issues) {
    const msg = issues[0].message;
    super(msg instanceof Function ? msg() : msg);
    this.name = 'ValiError';
    this.issues = issues;
  }
}

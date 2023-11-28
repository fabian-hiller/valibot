import type { Issues } from '../../types/index.ts';

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
    super(issues[0].message);
    this.name = 'ValiError';
    this.issues = issues;
  }
}

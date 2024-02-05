import type { SchemaIssues } from '../../types/index.ts';

/**
 * A Valibot error with useful information.
 */
export class ValiError extends Error {
  issues: SchemaIssues;

  /**
   * Creates a Valibot error with useful information.
   *
   * @param issues The error issues.
   */
  constructor(issues: SchemaIssues) {
    super(issues[0].message);
    this.name = 'ValiError';
    this.issues = issues;
  }
}

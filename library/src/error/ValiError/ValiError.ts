import type { LazyPath } from '../../utils/index.ts';

/**
 * Issue reason type.
 */
export type IssueReason =
  | 'type'
  | 'string'
  | 'number'
  | 'bigint'
  | 'blob'
  | 'boolean'
  | 'any'
  | 'unknown'
  | 'date'
  | 'array'
  | 'tuple'
  | 'map'
  | 'object'
  | 'record'
  | 'set'
  | 'special'
  | 'instance';

/**
 * Issue origin type.
 */
export type IssueOrigin = 'key' | 'value';

/**
 * Issue type.
 */
export type Issue = {
  reason: IssueReason;
  validation: string;
  origin: IssueOrigin;
  message: string;
  input: any;
  path?: LazyPath;
  issues?: Issues;
  abortEarly?: boolean;
  abortPipeEarly?: boolean;
};

/**
 * Issues type.
 */
export type Issues = [Issue, ...Issue[]];

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

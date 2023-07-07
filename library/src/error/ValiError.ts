import type { PathItem } from '../types';

/**
 * Issue reason type.
 */
export type IssueReason =
  | 'type'
  | 'string'
  | 'number'
  | 'bigint'
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
  | 'special';

/**
 * Issue type.
 */
export type Issue = {
  reason: IssueReason;
  validation: string;
  origin: 'key' | 'value';
  message: string;
  input: any;
  path?: PathItem[];
  issues?: Issues;
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
   * @param code The error code.
   * @param message The error message.
   */
  constructor(issues: Issues) {
    super(issues[0].message);
    this.name = 'ValiError';
    this.issues = issues;
  }
}

import type { BaseIssue } from '../../types/index.ts';

/**
 * Array issue type.
 */
export interface ArrayIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'array';
  /**
   * The expected input.
   */
  readonly expected: 'Array';
}

/**
 * Array path item type.
 */
export interface ArrayPathItem {
  type: 'array';
  origin: 'value';
  input: unknown[];
  key: number;
  value: unknown;
}

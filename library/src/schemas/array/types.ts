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
  /**
   * The path item type.
   */
  readonly type: 'array';
  /**
   * The path item origin.
   */
  readonly origin: 'value';
  /**
   * The path item input.
   */
  readonly input: unknown[];
  /**
   * The path item key.
   */
  readonly key: number;
  /**
   * The path item value.
   */
  readonly value: unknown;
}

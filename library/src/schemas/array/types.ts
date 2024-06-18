import type { BaseIssue, MaybeReadonly } from '../../types/index.ts';

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
   * The expected property.
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
  readonly input: MaybeReadonly<unknown[]>;
  /**
   * The path item key.
   */
  readonly key: number;
  /**
   * The path item value.
   */
  readonly value: unknown;
}

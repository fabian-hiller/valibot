import type { BaseIssue } from './issue.ts';

/**
 * The typed dataset type.
 */
export interface TypedDataset<TValue, TIssue extends BaseIssue<unknown>> {
  /**
   * Whether is's typed.
   */
  typed: true;
  /**
   * The dataset value.
   */
  value: TValue;
  /**
   * The dataset issues.
   */
  issues?: [TIssue, ...TIssue[]];
}

/**
 * The untyped dataset type.
 */
export interface UntypedDataset<TIssue extends BaseIssue<unknown>> {
  /**
   * Whether is's typed.
   */
  typed: false;
  /**
   * The dataset value.
   */
  value: unknown;
  /**
   * The dataset issues.
   */
  issues?: [TIssue, ...TIssue[]];
}

/**
 * The dataset type.
 */
export type Dataset<TValue, TIssue extends BaseIssue<unknown>> =
  | TypedDataset<TValue, TIssue>
  | UntypedDataset<TIssue>;

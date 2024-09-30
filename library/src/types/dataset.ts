import type { BaseIssue } from './issue.ts';

/**
 * Unknown dataset type.
 */
export interface UnknownDataset {
  /**
   * Whether is's typed.
   */
  typed?: false;
  /**
   * The dataset value.
   */
  value: unknown;
  /**
   * The dataset issues.
   */
  issues?: undefined;
}

/**
 * Success dataset type.
 */
export interface SuccessDataset<TValue> {
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
  issues?: undefined;
}

/**
 * Partial dataset type.
 */
export interface PartialDataset<TValue, TIssue extends BaseIssue<unknown>> {
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
  issues: [TIssue, ...TIssue[]];
}

/**
 * Failure dataset type.
 */
export interface FailureDataset<TIssue extends BaseIssue<unknown>> {
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
  issues: [TIssue, ...TIssue[]];
}

/**
 * Output dataset type.
 */
export type OutputDataset<TValue, TIssue extends BaseIssue<unknown>> =
  | SuccessDataset<TValue>
  | PartialDataset<TValue, TIssue>
  | FailureDataset<TIssue>;

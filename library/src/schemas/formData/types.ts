import type { BaseIssue } from '../../types/index.ts';

/**
 * FormData issue type.
 */
export interface FormDataIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'formData';
  /**
   * The expected input.
   */
  readonly expected: 'FormData';
}

/**
 * FormData path item type.
 */
export interface FormDataPathItem {
  type: 'formData';
  origin: 'value';
  input: unknown;
  key: string;
  value: unknown;
}

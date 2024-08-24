import type { BaseIssue } from './issue.ts';
import type { ErrorMessage } from './other.ts';

/**
 * Config type.
 */
export interface Config<TIssue extends BaseIssue<unknown>> {
  /**
   * The selected language.
   */
  readonly lang?: string | undefined;
  /**
   * The error message.
   */
  readonly message?: ErrorMessage<TIssue> | undefined;
  /**
   * Whether it was abort early.
   */
  readonly abortEarly?: boolean | undefined;
  /**
   * Whether the pipe was abort early.
   */
  readonly abortPipeEarly?: boolean | undefined;
}

import type { BaseIssue } from './issue';
import type { ErrorMessage } from './other';

/**
 * The schema config type.
 */
export interface Config<TIssue extends BaseIssue<unknown>> {
  /**
   * The selected language.
   */
  readonly lang?: string;
  /**
   * The error message.
   */
  readonly message?: ErrorMessage<TIssue>;
  /**
   * Whether it was abort early.
   */
  readonly abortEarly?: boolean;
  /**
   * Whether the pipe was abort early.
   */
  readonly abortPipeEarly?: boolean;
  /**
   * Whether the pipe was skipped.
   */
  readonly skipPipe?: boolean;
}

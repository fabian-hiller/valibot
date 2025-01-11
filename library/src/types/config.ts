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
   * Whether it should be aborted early.
   */
  readonly abortEarly?: boolean | undefined;
  /**
   * Whether a pipe should be aborted early.
   */
  readonly abortPipeEarly?: boolean | undefined;
  /**
   * Whether to apply stricter rules to optional properties.
   */
  readonly exactOptionalProperties?: boolean | undefined;
}

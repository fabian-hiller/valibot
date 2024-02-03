import type { SchemaIssue } from './issues.ts';

/**
 * Error message type.
 */
export type ErrorMessage = string | ((issue: SchemaIssue) => string);

/**
 * The schema config type.
 */
export type SchemaConfig = {
  /**
   * The selected language.
   */
  lang?: string;
  /**
   * The error message.
   */
  message?: ErrorMessage;
  /**
   * Whether it was abort early.
   */
  abortEarly?: boolean;
  /**
   * Whether the pipe was abort early.
   */
  abortPipeEarly?: boolean;
  /**
   * Whether the pipe was skipped.
   */
  skipPipe?: boolean;
};

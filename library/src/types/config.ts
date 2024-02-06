import type { SchemaIssue } from './issues.ts';
import type { SchemaMetadata } from './schema.ts';

/**
 * Error message type.
 */
export type ErrorMessage = string | ((issue: SchemaIssue) => string);

/**
 * Error message or metadata type.
 */
export type ErrorMessageOrMetadata =
  | ErrorMessage
  | (SchemaMetadata & { message?: ErrorMessage });
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

import type {
  ErrorMessage,
  IssueReason,
  Issues,
  ParseInfo,
} from '../../types/index.ts';
import { getErrorMessage } from '../getErrorMessage/getErrorMessage.ts';

/**
 * Returns the schema result object with issues.
 *
 * @param info The parse info.
 * @param reason The issue reason.
 * @param validation The validation name.
 * @param message The error message.
 * @param input The input value.
 * @param issues The sub issues.
 * @param requirement The requirement.
 *
 * @returns The schema result object.
 */
export function getSchemaIssues(
  info: ParseInfo | undefined,
  reason: IssueReason,
  validation: string,
  message: ErrorMessage,
  input: unknown,
  issues?: Issues,
  requirement?: unknown
): { issues: Issues } {
  // Note: The issue is deliberately not constructed with the spread operator
  // for performance reasons
  return {
    issues: [
      {
        reason,
        validation,
        origin: info?.origin || 'value',
        message: getErrorMessage(message),
        input,
        issues,
        abortEarly: info?.abortEarly,
        abortPipeEarly: info?.abortPipeEarly,
        skipPipe: info?.skipPipe,
        requirement,
      },
    ],
  };
}

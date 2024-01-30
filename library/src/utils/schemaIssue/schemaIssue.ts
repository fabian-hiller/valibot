import type {
  ErrorMessage,
  IssueReason,
  Issues,
  ParseInfo,
  PathItem,
  UntypedSchemaResult,
} from '../../types/index.ts';
import { errorMessage } from '../errorMessage/errorMessage.ts';

/**
 * Returns the schema result object with issues.
 *
 * @param info The parse info.
 * @param reason The issue reason.
 * @param validation The validation name.
 * @param message The error message.
 * @param input The input value.
 * @param path The issue path.
 * @param issues The sub issues.
 *
 * @returns The schema result object.
 */
export function schemaIssue(
  info: ParseInfo | undefined,
  reason: IssueReason,
  validation: string,
  message: ErrorMessage,
  input: unknown,
  path?: PathItem[],
  issues?: Issues
): UntypedSchemaResult {
  // Note: The issue is deliberately not constructed with the spread operator
  // for performance reasons
  return {
    typed: false,
    output: input,
    issues: [
      {
        reason,
        validation,
        origin: info?.origin || 'value',
        message: errorMessage(message),
        input,
        path,
        issues,
        abortEarly: info?.abortEarly,
        abortPipeEarly: info?.abortPipeEarly,
        skipPipe: info?.skipPipe,
      },
    ],
  };
}

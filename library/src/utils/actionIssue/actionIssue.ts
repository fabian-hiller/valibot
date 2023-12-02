import type { ErrorMessage, InvalidActionResult } from '../../types/index.ts';
import { errorMessage } from '../errorMessage/index.ts';

/**
 * Returns the pipeline result object with issues.
 *
 * @param validation The validation name.
 * @param message The error message.
 * @param input The input value.
 * @param requirement The requirement.
 *
 * @returns The pipeline result object.
 */
export function actionIssue(
  validation: string,
  message: ErrorMessage,
  input: unknown,
  requirement?: unknown
): InvalidActionResult {
  return {
    issues: [
      {
        validation,
        message: errorMessage(message),
        input,
        requirement,
      },
    ],
  };
}

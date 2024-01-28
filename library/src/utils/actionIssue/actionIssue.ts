import type {
  InvalidActionResult,
  PipeActionContext,
} from '../../types/index.ts';

/**
 * Returns the pipeline result object with issues.
 *
 * @param context The action context.
 * @param input The raw input data.
 * @param label The issue label.
 * @param received The received input.
 *
 * @returns The pipeline result object.
 */
export function actionIssue(
  context: PipeActionContext,
  input: unknown,
  label: string,
  received?: string
): InvalidActionResult {
  return {
    issues: [{ context, input, label, received }],
  };
}

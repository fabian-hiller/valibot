import type {
  InvalidActionResult,
  PipeActionContext,
} from '../../types/index.ts';

/**
 * Returns the pipeline result object with issues.
 *
 * @param context The action context.
 * @param reference The action reference.
 * @param input The raw input data.
 * @param label The issue label.
 * @param received The received input.
 *
 * @returns The pipeline result object.
 */
export function actionIssue(
  context: PipeActionContext,
  // eslint-disable-next-line @typescript-eslint/ban-types
  reference: Function,
  input: unknown,
  label: string,
  received?: string
): InvalidActionResult {
  return {
    issues: [{ context, reference, input, label, received }],
  };
}

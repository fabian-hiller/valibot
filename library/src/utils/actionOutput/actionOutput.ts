import type { ValidActionResult } from '../../types/index.ts';

/**
 * Returns the pipeline action output.
 *
 * @param output The output value.
 *
 * @returns The result object.
 */
export function actionOutput<TOutput>(
  output: TOutput
): ValidActionResult<TOutput> {
  return { output };
}

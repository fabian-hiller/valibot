/**
 * Returns the result object with an output.
 * @param output The output value.
 * @returns The result object.
 */
export function getOutput<TOutput>(output: TOutput): { output: TOutput } {
  return { output };
}

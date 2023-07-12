/**
 * Creates a async custom transformation functions.
 *
 * @param action The transform action.
 *
 * @returns A async transformation functions.
 */
export function toCustomAsync<TInput>(
  action: (input: TInput) => TInput | Promise<TInput>
) {
  return (input: TInput) => action(input);
}

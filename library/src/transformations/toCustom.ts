/**
 * Creates a custom transformation functions.
 *
 * @param action The transform action.
 *
 * @returns A transformation functions.
 */
export function toCustom<TInput>(action: (input: TInput) => TInput) {
  return (input: TInput) => action(input);
}

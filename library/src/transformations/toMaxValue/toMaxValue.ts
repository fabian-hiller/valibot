/**
 * Creates a transformation function that sets a string, number or date to a
 * maximum value.
 *
 * @param requirement The maximum value.
 *
 * @returns A transformation function.
 */
export function toMaxValue<
  TInput extends string | number | bigint | Date,
  TRequirement extends TInput
>(requirement: TRequirement) {
  return (input: TInput) => (input > requirement ? requirement : input);
}

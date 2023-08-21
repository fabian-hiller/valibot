import type { _ParseResult } from '../../types.ts';

/**
 * Creates a custom transformation function.
 *
 * @param action The transform action.
 *
 * @returns A transformation function.
 */
export function toCustom<TInput>(action: (input: TInput) => TInput) {
  return (input: TInput): _ParseResult<TInput> => ({ output: action(input) });
}

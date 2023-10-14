import type { PipeResult } from '../../types.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * Creates a custom transformation function.
 *
 * @param action The transform action.
 *
 * @returns A transformation function.
 */
export function toCustom<TInput>(action: (input: TInput) => TInput) {
  return {
    kind: 'to_custom' as const,
    _parse(input: TInput): PipeResult<TInput> {
      return getOutput(action(input));
    },
  };
}

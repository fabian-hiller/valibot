import type { BaseTransformation } from '../../types/index.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * To custom transformation type.
 */
export type ToCustomTransformation<TInput> = BaseTransformation<TInput> & {
  /**
   * The transformation type.
   */
  type: 'to_custom';
};

/**
 * Creates a custom transformation function.
 *
 * @param action The transform action.
 *
 * @returns A transformation function.
 */
export function toCustom<TInput>(
  action: (input: TInput) => TInput
): ToCustomTransformation<TInput> {
  return {
    type: 'to_custom',
    async: false,
    _parse(input) {
      return getOutput(action(input));
    },
  };
}

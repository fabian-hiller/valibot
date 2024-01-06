import type { BaseTransformation } from '../../types/index.ts';
import { actionOutput } from '../../utils/index.ts';

/**
 * To custom transformation type.
 */
export interface ToCustomTransformation<TInput>
  extends BaseTransformation<TInput> {
  /**
   * The transformation type.
   */
  type: 'to_custom';
}

/**
 * Creates a custom pipeline transformation action.
 *
 * @param action The transform action.
 *
 * @returns A transformation action.
 */
export function toCustom<TInput>(
  action: (input: TInput) => TInput
): ToCustomTransformation<TInput> {
  return {
    type: 'to_custom',
    async: false,
    _parse(input) {
      return actionOutput(action(input));
    },
  };
}

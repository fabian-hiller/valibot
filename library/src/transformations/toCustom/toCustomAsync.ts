import type { BaseTransformationAsync } from '../../types/index.ts';
import { actionOutput } from '../../utils/index.ts';

/**
 * To custom transformation async type.
 */
export interface ToCustomTransformationAsync<TInput>
  extends BaseTransformationAsync<TInput> {
  /**
   * The transformation type.
   */
  type: 'to_custom';
}

/**
 * Creates a async custom transformation function.
 *
 * @param action The transform action.
 *
 * @returns A async transformation function.
 */
export function toCustomAsync<TInput>(
  action: (input: TInput) => TInput | Promise<TInput>
): ToCustomTransformationAsync<TInput> {
  return {
    type: 'to_custom',
    async: true,
    async _parse(input) {
      return actionOutput(await action(input));
    },
  };
}

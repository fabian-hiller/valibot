import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';
import { HEX_COLOR_REGEX } from './../../regex.ts';

/**
 * Hex color validation type.
 */
export type HexColorValidation<TInput extends string> =
  BaseValidation<TInput> & {
    /**
     * The validation type.
     */
    type: 'hex_color';
    /**
     * The hex color regex.
     */
    requirement: RegExp;
  };

/**
 * Creates a pipeline validation action that validates hex color string.
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function hexColor<TInput extends string>(
  message?: ErrorMessage
): HexColorValidation<TInput> {
  return {
    type: 'hex_color',
    expects: null,
    async: false,
    message,
    requirement: HEX_COLOR_REGEX,
    _parse(input) {
      if (this.requirement.test(input)) {
        return actionOutput(input);
      }
      return actionIssue(this, input, 'hex color');
    },
  };
}

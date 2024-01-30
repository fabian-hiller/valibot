import { HEX_COLOR_REGEX } from './../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

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
 * Creates a pipeline validation action that validates hex color.
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function hexColor<TInput extends string>(
  message: ErrorMessage = 'Invalid hex color'
): HexColorValidation<TInput> {
  return {
    type: 'hex_color',
    async: false,
    message,
    requirement: HEX_COLOR_REGEX,
    _parse(input) {
      return !this.requirement.test(input)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}

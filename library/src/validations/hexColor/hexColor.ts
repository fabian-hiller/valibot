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
    type: 'hexColor';
    /**
     * The validation regex type.
     */
    requirement: RegExp;
  };

/**
 * Creates a validation function that validates whether a string is hex color.
 *
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function hexColor<TInput extends string>(
  message: ErrorMessage = 'Invalid hex color'
): HexColorValidation<TInput> {
  return {
    type: 'hexColor',
    async: false,
    message,
    requirement: HEX_COLOR_REGEX,
    _parse(input: TInput) {
      return !this.requirement.test(input)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}

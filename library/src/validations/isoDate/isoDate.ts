import { ISO_DATE_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * ISO date validation type.
 */
export type IsoDateValidation<TInput extends string> =
  BaseValidation<TInput> & {
    /**
     * The validation type.
     */
    type: 'iso_date';
    /**
     * The ISO date regex.
     */
    requirement: RegExp;
  };

/**
 * Creates a validation function that validates a date.
 *
 * Format: yyyy-mm-dd
 *
 * Hint: The regex used cannot validate the maximum number of days based on
 * year and month. For example, "2023-06-31" is valid although June has only
 * 30 days.
 *
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function isoDate<TInput extends string>(
  message: ErrorMessage = 'Invalid date'
): IsoDateValidation<TInput> {
  return {
    type: 'iso_date',
    async: false,
    message,
    requirement: ISO_DATE_REGEX,
    _parse(input) {
      return !this.requirement.test(input)
        ? getPipeIssues(this.type, this.message, input, this.requirement)
        : getOutput(input);
    },
  };
}

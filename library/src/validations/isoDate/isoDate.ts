import { ISO_DATE_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * ISO date validation type.
 */
export interface IsoDateValidation<TInput extends string>
  extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'iso_date';
  /**
   * The ISO date regex.
   */
  requirement: RegExp;
}

/**
 * Creates a pipeline validation action that validates a date.
 *
 * Format: yyyy-mm-dd
 *
 * Hint: The regex used cannot validate the maximum number of days based on
 * year and month. For example, "2023-06-31" is valid although June has only
 * 30 days.
 *
 * @param message The error message.
 *
 * @returns A validation action.
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
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}

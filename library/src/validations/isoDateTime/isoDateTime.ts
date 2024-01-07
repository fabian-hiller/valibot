import { ISO_DATE_TIME_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * ISO date time validation type.
 */
export interface IsoDateTimeValidation<TInput extends string>
  extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'iso_date_time';
  /**
   * The ISO date time regex.
   */
  requirement: RegExp;
}

/**
 * Creates a pipeline validation action that validates a datetime.
 *
 * Format: yyyy-mm-ddThh:mm
 *
 * Hint: The regex used cannot validate the maximum number of days based on
 * year and month. For example, "2023-06-31T00:00" is valid although June has only
 * 30 days.
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function isoDateTime<TInput extends string>(
  message: ErrorMessage = 'Invalid date-time'
): IsoDateTimeValidation<TInput> {
  return {
    type: 'iso_date_time',
    async: false,
    message,
    requirement: ISO_DATE_TIME_REGEX,
    _parse(input) {
      return !this.requirement.test(input)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}

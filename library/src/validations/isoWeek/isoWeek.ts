import { ISO_WEEK_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * ISO week validation type.
 */
export interface IsoWeekValidation<TInput extends string>
  extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'iso_week';
  /**
   * The ISO week regex.
   */
  requirement: RegExp;
}

/**
 * Creates a validation function that validates a week.
 *
 * Format: yyyy-Www
 *
 * Hint: The regex used cannot validate the maximum number of weeks based on
 * the year. For example, "2021W53" is valid even though the year 2021 has only
 * 52 weeks.
 *
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function isoWeek<TInput extends string>(
  message: ErrorMessage = 'Invalid week'
): IsoWeekValidation<TInput> {
  return {
    type: 'iso_week',
    async: false,
    message,
    requirement: ISO_WEEK_REGEX,
    _parse(input) {
      return !this.requirement.test(input)
        ? getPipeIssues(this.type, this.message, input, this.requirement)
        : getOutput(input);
    },
  };
}

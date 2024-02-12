import { ISO_TIMESTAMP_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * ISO timestamp validation type.
 */
export type IsoTimestampValidation<TInput extends string> =
  BaseValidation<TInput> & {
    /**
     * The validation type.
     */
    type: 'iso_timestamp';
    /**
     * The ISO timestamp regex.
     */
    requirement: RegExp;
  };

/**
 * Creates a pipeline validation action that validates a timestamp.
 *
 * Format: yyyy-mm-ddThh:mm:ss.sssZ
 *
 * Hint: To support timestamps with lower or higher accuracy, the millisecond
 * specification can be removed or contain up to 9 digits.
 *
 * Hint: The regex used cannot validate the maximum number of days based on
 * year and month. For example, "2023-06-31T00:00:00.000Z" is valid although
 * June has only 30 days.
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function isoTimestamp<TInput extends string>(
  message?: ErrorMessage
): IsoTimestampValidation<TInput> {
  return {
    type: 'iso_timestamp',
    expects: null,
    async: false,
    message,
    requirement: ISO_TIMESTAMP_REGEX,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (this.requirement.test(input)) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, isoTimestamp, input, 'timestamp');
    },
  };
}

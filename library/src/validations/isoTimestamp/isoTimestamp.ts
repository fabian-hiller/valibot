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
 * Format: yyyy-mm-ddThh:mm:ss.sssssssssZ
 *   - yyyy: 4-digit year
 *   - mm: 2-digit month
 *   - dd: 2-digit day
 *   - hh: 2-digit hour (00-23)
 *   - mm: 2-digit minute (00-59)
 *   - ss: 2-digit second (00-59)
 *   - sssssssss: Up to 9-digit millisecond precision
 *   - Z: Timezone offset (e.g., +00:00 or -07:00, Z=UTC+0)
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
  message: ErrorMessage = 'Invalid timestamp'
): IsoTimestampValidation<TInput> {
  return {
    type: 'iso_timestamp',
    async: false,
    message,
    requirement: ISO_TIMESTAMP_REGEX,
    _parse(input) {
      return !this.requirement.test(input)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}

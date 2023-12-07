import { ISO_TIME_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * ISO time validation type.
 */
export type IsoTimeValidation<TInput extends string> =
  BaseValidation<TInput> & {
    /**
     * The validation type.
     */
    type: 'iso_time';
    /**
     * The ISO time regex.
     */
    requirement: RegExp;
  };

/**
 * Creates a validation function that validates a time.
 *
 * Format: hh:mm
 *
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function isoTime<TInput extends string>(
  message: ErrorMessage = 'Invalid time'
): IsoTimeValidation<TInput> {
  return {
    type: 'iso_time',
    async: false,
    message,
    requirement: ISO_TIME_REGEX,
    _parse(input) {
      return !this.requirement.test(input)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}

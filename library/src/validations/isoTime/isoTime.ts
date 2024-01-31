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
 * Creates a pipeline validation action that validates a time.
 *
 * Format: hh:mm
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function isoTime<TInput extends string>(
  message?: ErrorMessage
): IsoTimeValidation<TInput> {
  return {
    type: 'iso_time',
    expects: null,
    async: false,
    message,
    requirement: ISO_TIME_REGEX,
    _parse(input) {
      if (this.requirement.test(input)) {
        return actionOutput(input);
      }
      return actionIssue(this, isoTime, input, 'time');
    },
  };
}

import { ISO_TIME_SECOND_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * ISO time second validation type.
 */
export interface IsoTimeSecondValidation<TInput extends string>
  extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'iso_time_second';
  /**
   * The ISO time second regex.
   */
  requirement: RegExp;
}

/**
 * Creates a pipeline validation action that validates a time with seconds.
 *
 * Format: hh:mm:ss
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function isoTimeSecond<TInput extends string>(
  message?: ErrorMessage
): IsoTimeSecondValidation<TInput> {
  return {
    type: 'iso_time_second',
    expects: null,
    async: false,
    message,
    requirement: ISO_TIME_SECOND_REGEX,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (this.requirement.test(input)) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, isoTimeSecond, input, 'time second');
    },
  };
}

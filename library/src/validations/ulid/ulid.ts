import { ULID_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * ULID validation type.
 */
export interface UlidValidation<TInput extends string>
  extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'ulid';
  /**
   * The ULID regex.
   */
  requirement: RegExp;
}

/**
 * Creates a pipeline validation action that validates a [ULID](https://github.com/ulid/spec).
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function ulid<TInput extends string>(
  message?: ErrorMessage
): UlidValidation<TInput> {
  return {
    type: 'ulid',
    expects: null,
    async: false,
    message,
    requirement: ULID_REGEX,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (this.requirement.test(input)) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, ulid, input, 'ULID');
    },
  };
}

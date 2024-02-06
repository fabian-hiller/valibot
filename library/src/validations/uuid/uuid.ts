import { UUID_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * UUID validation type.
 */
export type UuidValidation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'uuid';
  /**
   * The UUID regex.
   */
  requirement: RegExp;
};

/**
 * Creates a pipeline validation action that validates a [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier).
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function uuid<TInput extends string>(
  message?: ErrorMessage
): UuidValidation<TInput> {
  return {
    type: 'uuid',
    expects: null,
    async: false,
    message,
    requirement: UUID_REGEX,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (this.requirement.test(input)) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, uuid, input, 'UUID');
    },
  };
}

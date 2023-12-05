import { UUID_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * UUID validation type.
 */
export interface UuidValidation<TInput extends string>
  extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'uuid';
  /**
   * The UUID regex.
   */
  requirement: RegExp;
}

/**
 * Creates a validation function that validates a [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier).
 *
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function uuid<TInput extends string>(
  message: ErrorMessage = 'Invalid UUID'
): UuidValidation<TInput> {
  return {
    type: 'uuid',
    async: false,
    message,
    requirement: UUID_REGEX,
    _parse(input) {
      return !this.requirement.test(input)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}

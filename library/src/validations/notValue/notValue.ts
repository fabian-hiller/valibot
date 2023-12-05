import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Not value validation type.
 */
export interface NotValueValidation<
  TInput extends string | number | bigint | boolean | Date,
  TRequirement extends TInput
> extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'not_value';
  /**
   * The value.
   */
  requirement: TRequirement;
}

/**
 * Creates a validation function that validates the value of a string or number.
 *
 * @param requirement The value.
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function notValue<
  TInput extends string | number | bigint | boolean | Date,
  TRequirement extends TInput
>(
  requirement: TRequirement,
  message: ErrorMessage = 'Invalid value'
): NotValueValidation<TInput, TRequirement> {
  return {
    type: 'not_value',
    async: false,
    message,
    requirement,
    _parse(input) {
      return input === this.requirement
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}

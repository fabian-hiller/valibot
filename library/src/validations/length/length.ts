import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Length validation type.
 */
export interface LengthValidation<
  TInput extends string | any[],
  TRequirement extends number
> extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'length';
  /**
   * The length.
   */
  requirement: TRequirement;
}

/**
 * Creates a pipeline validation action that validates the length of a string
 * or array.
 *
 * @param requirement The length.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function length<
  TInput extends string | any[],
  TRequirement extends number
>(
  requirement: TRequirement,
  message: ErrorMessage = 'Invalid length'
): LengthValidation<TInput, TRequirement> {
  return {
    type: 'length',
    async: false,
    message,
    requirement,
    _parse(input) {
      return input.length !== this.requirement
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}

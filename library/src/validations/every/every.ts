import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Every validation type.
 */
export interface EveryValidation<TInput extends any[]>
  extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'every';
  /**
   * The validation function.
   */
  requirement: (
    element: TInput[number],
    index: number,
    array: TInput[number][]
  ) => boolean;
}

/**
 * Creates a pipeline validation action that validates the items of an array.
 *
 * @param requirement The validation function.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function every<TInput extends any[]>(
  requirement: (
    element: TInput[number],
    index: number,
    array: TInput[number][]
  ) => boolean,
  message?: ErrorMessage
): EveryValidation<TInput> {
  return {
    type: 'every',
    expects: null,
    async: false,
    message,
    requirement,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (input.every(this.requirement)) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, every, input, 'input');
    },
  };
}
